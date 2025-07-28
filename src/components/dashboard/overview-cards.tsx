import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from "@/lib/data";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export function OverviewCards() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const cards = [
    {
      title: "Total Balance",
      amount: totalBalance,
      icon: Wallet,
      change: null,
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      change: "+20.1% from last month",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      change: "+12.2% from last month",
    },
    {
      title: "Savings Goal",
      amount: 7500,
      icon: DollarSign,
      change: "75% of $10,000 goal",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.amount)}</div>
            {card.change && (
              <p className="text-xs text-muted-foreground">{card.change}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
