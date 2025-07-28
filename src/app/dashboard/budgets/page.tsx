
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
    { name: "Groceries", spent: 350, total: 500, remaining: 150 },
    { name: "Dining Out", spent: 150, total: 200, remaining: 50 },
    { name: "Shopping", spent: 500, total: 600, remaining: 100 },
    { name: "Transport", spent: 80, total: 100, remaining: 20 },
  ];

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
                ${budget.remaining.toFixed(2)} remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(budget.spent / budget.total) * 100} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                ${budget.spent.toFixed(2)} of ${budget.total.toFixed(2)} spent
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
