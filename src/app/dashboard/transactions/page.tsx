
"use client";

import * as React from "react";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import RecentTransactions from "@/components/dashboard/recent-transactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${transactions.length + 1}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <RecentTransactions transactions={transactions} addTransaction={addTransaction} />
    </>
  );
}
