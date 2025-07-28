
"use client";

import * as React from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AiInsights from "@/components/dashboard/ai-insights";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(userTransactions);
      });
      return () => unsubscribe();
    } else {
      // Set initial transactions for guest users, or clear them
      setTransactions(initialTransactions);
    }
  }, [user]);

  const addTransaction = async (
    transaction: Omit<Transaction, "id">
  ) => {
    if (user) {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
    } else {
      // Handle guest user case if needed
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
        <div>
          <AiInsights transactions={transactions} />
        </div>
      </div>
      <RecentTransactions
        transactions={transactions}
        addTransaction={addTransaction}
      />
    </>
  );
}
