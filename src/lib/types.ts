import type { LucideIcon } from "lucide-react";

export type Category =
  | "Food"
  | "Travel"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Income";

export type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: Category;
  type: "income" | "expense";
};

export type CategoryInfo = {
  icon: LucideIcon;
  color: string;
};

export type Budget = {
  id: string;
  category: Category;
  total: number;
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
};
