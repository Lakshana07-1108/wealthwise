
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, CreditCard, Banknote } from "lucide-react";

export default function AccountsPage() {
  const accounts = [
    { name: "Checking Account", type: "Bank", balance: 5250.00, icon: Banknote },
    { name: "Savings Account", type: "Bank", balance: 15000.75, icon: Banknote },
    { name: "Primary Credit Card", type: "Credit Card", balance: -850.50, icon: CreditCard },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Accounts</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
              <account.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{account.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
