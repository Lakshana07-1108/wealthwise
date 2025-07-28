
"use client";

import * as React from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { Transaction } from "@/lib/types";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { useAuth } from "@/hooks/use-auth";

export default function TransactionsPage() {
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
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <RecentTransactions
        transactions={transactions}
        addTransaction={addTransaction}
      />
    </>
  );
}
