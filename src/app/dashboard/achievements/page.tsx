
"use client";

import * as React from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction, Budget, Bill } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, ShieldCheck, ShieldAlert, Badge } from "lucide-react";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: (data: { transactions: Transaction[]; budgets: Budget[]; bills: Bill[] }) => boolean;
};

const achievements: Achievement[] = [
  {
    id: "first-budget",
    name: "Budget Beginner",
    description: "Create your first budget to start tracking your spending.",
    icon: Trophy,
    isUnlocked: ({ budgets }) => budgets.length > 0,
  },
  {
    id: "ten-transactions",
    name: "Transaction Titan",
    description: "Manually add at least 10 transactions.",
    icon: Trophy,
    isUnlocked: ({ transactions }) => transactions.length >= 10,
  },
  {
    id: "savvy-saver",
    name: "Savvy Saver",
    description: "Achieve a positive net balance for the current month.",
    icon: Trophy,
    isUnlocked: ({ transactions }) => {
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return income > expense;
    },
  },
  {
    id: 'bill-buster',
    name: 'Bill Buster',
    description: 'Add and track at least 5 bills.',
    icon: Trophy,
    isUnlocked: ({ bills }) => bills.length >= 5,
  },
  {
    id: 'category-king',
    name: 'Category King',
    description: 'Use all available spending categories.',
    icon: Trophy,
    isUnlocked: ({ transactions }) => {
        const usedCategories = new Set(transactions.map(t => t.category));
        return usedCategories.size >= 5; // Excluding 'Income'
    }
  },
  {
    id: 'receipt-scanner',
    name: 'Receipt Scanner',
    description: 'Scan your first receipt.',
    icon: Trophy,
    isUnlocked: ({ transactions }) => {
        // This is a placeholder, as we can't directly track if a transaction was from a scan
        // A real implementation would add a source property to the transaction
        return false;
    }
  }
];

export default function AchievementsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [bills, setBills] = React.useState<Bill[]>([]);

  React.useEffect(() => {
    if (user) {
      const tq = query(collection(db, `users/${user.uid}/transactions`));
      const bq = query(collection(db, `users/${user.uid}/budgets`));
      const billq = query(collection(db, `users/${user.uid}/bills`));

      const unsubscribeTransactions = onSnapshot(tq, (snapshot) => {
        const data: Transaction[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(data);
      });

      const unsubscribeBudgets = onSnapshot(bq, (snapshot) => {
        const data: Budget[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Budget));
        setBudgets(data);
      });

      const unsubscribeBills = onSnapshot(billq, (snapshot) => {
        const data: Bill[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Bill));
        setBills(data);
      });

      return () => {
        unsubscribeTransactions();
        unsubscribeBudgets();
        unsubscribeBills();
      };
    }
  }, [user]);

  const unlockedCount = achievements.filter(a => a.isUnlocked({ transactions, budgets, bills })).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock badges for your financial discipline.
        </p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>You've unlocked {unlockedCount} of {achievements.length} achievements.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}></div>
              </div>
          </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const isUnlocked = achievement.isUnlocked({ transactions, budgets, bills });
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className={`transition-all ${isUnlocked ? 'border-primary border-2' : 'opacity-60'}`}>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                 <div className={`p-4 rounded-full ${isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-8 w-8" />
                 </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {isUnlocked ? (
                    <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">Unlocked</Badge>
                ): (
                    <Badge variant="secondary">Locked</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
