
"use client";

import * as React from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import AiInsights from "@/components/dashboard/ai-insights";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction, Bill } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import UpcomingBills from "@/components/dashboard/upcoming-bills";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [bills, setBills] = React.useState<Bill[]>([]);

  React.useEffect(() => {
    if (user) {
      const tq = query(collection(db, `users/${user.uid}/transactions`));
      const unsubscribeTransactions = onSnapshot(tq, (querySnapshot) => {
        const userTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(userTransactions);
      });

      const bq = query(collection(db, `users/${user.uid}/bills`));
      const unsubscribeBills = onSnapshot(bq, (querySnapshot) => {
        const userBills: Bill[] = [];
        querySnapshot.forEach((doc) => {
          userBills.push({ id: doc.id, ...doc.data() } as Bill);
        });
        setBills(userBills);
      });

      return () => {
        unsubscribeTransactions();
        unsubscribeBills();
      };
    } else {
      // Set initial transactions for guest users, or clear them
      setTransactions(initialTransactions);
      setBills([]);
    }
  }, [user]);
  
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
    } else {
       const newTransaction = {
        ...transaction,
        id: `txn-${transactions.length + 1}`,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCards transactions={transactions} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SpendingChart transactions={transactions} />
        </div>
        <div className="flex flex-col gap-4">
          <AiInsights transactions={transactions} />
          <UpcomingBills bills={bills} />
        </div>
      </div>
       <RecentTransactions
        transactions={transactions}
        addTransaction={addTransaction}
        showViewAll={true}
      />
    </>
  );
}
