import type { LucideIcon } from "lucide-react";

export type TransactionType = "income" | "expense" | "transfer";

export type TransactionCategory =
  | "salary"
  | "advance"
  | "food"
  | "utilities"
  | "transport"
  | "entertainment"
  | "health"
  | "transfer"
  | "loan_payment"
  | "other";

export interface Account {
  id: string;
  name: string;
  type: "card" | "cash" | "savings";
  icon: LucideIcon;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  accountId: string;
  category: TransactionCategory;
  amount: number;
  date: string;
  description: string;
  loanId?: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  icon: LucideIcon;
}

export interface UpcomingExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  priority: "low" | "medium" | "high";
  isLoan?: boolean;
}

export interface Investment {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  price: number;
  history: {
    date: string;
    price: number;
  }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "owner" | "admin" | "viewer";
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface Loan {
  id: string;
  name: string;
  type: "credit" | "installment" | "personal";
  initialAmount: number;
  currentBalance: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  monthlyPayment: number;
  history: {
    date: string;
    balance: number;
  }[];
}
