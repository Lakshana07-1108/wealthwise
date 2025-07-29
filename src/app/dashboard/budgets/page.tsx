
"use client";

import * as React from "react";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Budget, Transaction } from "@/lib/types";
import { AddBudget } from "@/components/dashboard/add-budget";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BudgetsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    if (user) {
      const budgetQuery = query(collection(db, `users/${user.uid}/budgets`));
      const budgetUnsubscribe = onSnapshot(budgetQuery, (snapshot) => {
        const userBudgets: Budget[] = [];
        snapshot.forEach((doc) => {
          userBudgets.push({ id: doc.id, ...doc.data() } as Budget);
        });
        setBudgets(userBudgets);
      });

      const transactionQuery = query(collection(db, `users/${user.uid}/transactions`));
      const transactionUnsubscribe = onSnapshot(transactionQuery, (snapshot) => {
        const userTransactions: Transaction[] = [];
        snapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(userTransactions);
      });

      return () => {
        budgetUnsubscribe();
        transactionUnsubscribe();
      };
    } else {
      // Handle guest user if necessary, for now it's empty
      setBudgets([]);
      setTransactions([]);
    }
  }, [user]);

  const addBudget = async (budget: Omit<Budget, "id">) => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/budgets`), budget);
    }
  };
  
  const getSpentAmount = (category: string) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Budgets</h1>
        <AddBudget addBudget={addBudget} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const spent = getSpentAmount(budget.category);
          const remaining = budget.total - spent;
          const progress = (spent / budget.total) * 100;

          return (
            <Card key={budget.id}>
              <CardHeader>
                <CardTitle>{budget.category}</CardTitle>
                <CardDescription>
                  {formatCurrency(remaining)} remaining
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(spent)} of {formatCurrency(budget.total)} spent
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
       {budgets.length === 0 && (
          <div className="text-center text-muted-foreground col-span-full mt-8">
            <p>You haven't created any budgets yet.</p>
            <p>Click "Create Budget" to get started.</p>
          </div>
        )}
    </>
  );
}
