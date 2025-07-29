
"use client";

import {
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transaction, Category } from "@/lib/types";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function SpendingChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.total += transaction.amount;
      } else {
        acc.push({ name: category, total: transaction.amount });
      }
      return acc;
    }, [] as { name: Category; total: number }[]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
        <CardDescription>
          Your spending breakdown for this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
            />
            <Pie
              data={expenseData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
