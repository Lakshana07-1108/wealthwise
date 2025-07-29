
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle } from "lucide-react";

export default function BudgetsPage() {
  const budgets = [
    { name: "Groceries", spent: 30000, total: 40000, remaining: 10000 },
    { name: "Dining Out", spent: 12000, total: 15000, remaining: 3000 },
    { name: "Shopping", spent: 45000, total: 50000, remaining: 5000 },
    { name: "Transport", spent: 7000, total: 8000, remaining: 1000 },
  ];
  
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <Card key={budget.name}>
            <CardHeader>
              <CardTitle>{budget.name}</CardTitle>
              <CardDescription>
                {formatCurrency(budget.remaining)} remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(budget.spent / budget.total) * 100} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(budget.spent)} of {formatCurrency(budget.total)} spent
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
