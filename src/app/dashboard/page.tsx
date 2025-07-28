"use client";

import * as React from "react";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AiInsights from "@/components/dashboard/ai-insights";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";

export default function Dashboard() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `txn${transactions.length + 1}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
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
       <RecentTransactions transactions={transactions} addTransaction={addTransaction} />
    </>
  );
}
