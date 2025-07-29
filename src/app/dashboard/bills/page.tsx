
"use client";

import * as React from "react";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Bill } from "@/lib/types";
import { AddBill } from "@/components/dashboard/add-bill";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = React.useState<Bill[]>([]);

  React.useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/bills`));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userBills: Bill[] = [];
        snapshot.forEach((doc) => {
          userBills.push({ id: doc.id, ...doc.data() } as Bill);
        });
        setBills(userBills.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      });

      return () => unsubscribe();
    } else {
      setBills([]);
    }
  }, [user]);

  const addBill = async (bill: Omit<Bill, "id">) => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/bills`), bill);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: "destructive" as const };
    if (diffDays === 0) return { text: "Due today", color: "destructive" as const};
    if (diffDays === 1) return { text: "Due tomorrow", color: "secondary" as const };
    return { text: `Due in ${diffDays} days`, color: "default" as const};
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Bills & Subscriptions</h1>
        <AddBill addBill={addBill} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>
            Manage your recurring bills and subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bills.map((bill) => {
               const status = getDueDateStatus(bill.dueDate);
               return (
                <div key={bill.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                        <p className="font-semibold">{bill.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(bill.amount)} - {new Date(bill.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant={status.color}>{status.text}</Badge>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Button variant="outline">Pay Now</Button>
                    </div>
                </div>
               )
            })}
             {bills.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>You haven't added any bills yet.</p>
                    <p>Click "Add Bill" to get started.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
