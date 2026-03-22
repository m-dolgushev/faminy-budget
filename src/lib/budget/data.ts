import type {
  Account,
  FamilyMember,
  Investment,
  Loan,
  SavingGoal,
  Transaction,
  UpcomingExpense,
  UserProfile,
} from "@/lib/budget/types";
import { Banknote, Car, CreditCard, Landmark, Palmtree, UtensilsCrossed } from "lucide-react";

export const accounts: Account[] = [
  { id: "acc_1", name: "Сбербанк (Личное)", type: "card", icon: CreditCard },
  { id: "acc_2", name: "Тинькофф (Общее)", type: "card", icon: CreditCard },
  { id: "acc_3", name: "Наличные", type: "cash", icon: Banknote },
  { id: "acc_4", name: "Финансовая подушка", type: "savings", icon: Landmark },
  { id: "acc_5", name: "Еда", type: "card", icon: UtensilsCrossed },
  { id: "acc_6", name: "Здоровье", type: "card", icon: CreditCard },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    accountId: "acc_1",
    category: "salary",
    amount: 150000,
    date: "2026-03-01",
    description: "Зарплата",
  },
  {
    id: "2",
    type: "income",
    accountId: "acc_2",
    category: "advance",
    amount: 50000,
    date: "2026-03-10",
    description: "Аванс",
  },
  {
    id: "3",
    type: "expense",
    accountId: "acc_5",
    category: "food",
    amount: 15000,
    date: "2026-03-03",
    description: "Продукты",
  },
  {
    id: "4",
    type: "expense",
    accountId: "acc_2",
    category: "utilities",
    amount: 8000,
    date: "2026-03-05",
    description: "Коммунальные платежи",
  },
  {
    id: "5",
    type: "expense",
    accountId: "acc_1",
    category: "entertainment",
    amount: 3000,
    date: "2026-03-11",
    description: "Кино",
  },
  {
    id: "6",
    type: "transfer",
    accountId: "acc_1",
    category: "transfer",
    amount: 10000,
    date: "2026-03-12",
    description: "Перевод: Сбербанк (Личное) → Еда",
  },
  {
    id: "7",
    type: "transfer",
    accountId: "acc_5",
    category: "transfer",
    amount: 10000,
    date: "2026-03-12",
    description: "Перевод: Сбербанк (Личное) → Еда",
  },
];

export const savings: SavingGoal[] = [
  { id: "s1", name: "Отпуск на море", current: 45000, target: 150000, icon: Palmtree },
  { id: "s2", name: "Новый автомобиль", current: 300000, target: 1500000, icon: Car },
];

export const upcomingExpenses: UpcomingExpense[] = [
  { id: "u1", name: "Страховка авто", amount: 12000, dueDate: "2026-04-01", priority: "high" },
  { id: "u2", name: "Подарки", amount: 20000, dueDate: "2026-04-20", priority: "medium" },
];

export const investments: Investment[] = [
  {
    id: "i1",
    ticker: "SBER",
    name: "Сбербанк",
    quantity: 100,
    price: 270.5,
    history: [
      { date: "2026-03-01", price: 255.1 },
      { date: "2026-03-08", price: 262.8 },
      { date: "2026-03-15", price: 267.3 },
      { date: "2026-03-22", price: 270.5 },
    ],
  },
  {
    id: "i2",
    ticker: "LKOH",
    name: "Лукойл",
    quantity: 50,
    price: 7100,
    history: [
      { date: "2026-03-01", price: 6870 },
      { date: "2026-03-08", price: 6950 },
      { date: "2026-03-15", price: 7030 },
      { date: "2026-03-22", price: 7100 },
    ],
  },
  {
    id: "i3",
    ticker: "GMKN",
    name: "Норникель",
    quantity: 10,
    price: 14500,
    history: [
      { date: "2026-03-01", price: 13950 },
      { date: "2026-03-08", price: 14120 },
      { date: "2026-03-15", price: 14310 },
      { date: "2026-03-22", price: 14500 },
    ],
  },
];

export const loans: Loan[] = [
  {
    id: "l1",
    name: "Ипотека Квартира",
    type: "credit",
    initialAmount: 5000000,
    currentBalance: 4800000,
    interestRate: 9.5,
    termMonths: 240,
    startDate: "2023-01-15",
    monthlyPayment: 46608,
    history: [
      { date: "2025-12-22", balance: 4920000 },
      { date: "2026-01-22", balance: 4880000 },
      { date: "2026-02-22", balance: 4840000 },
      { date: "2026-03-22", balance: 4800000 },
    ],
  },
  {
    id: "l2",
    name: "Рассрочка iPhone",
    type: "installment",
    initialAmount: 120000,
    currentBalance: 60000,
    interestRate: 0,
    termMonths: 12,
    startDate: "2025-09-01",
    monthlyPayment: 10000,
    history: [
      { date: "2025-12-01", balance: 90000 },
      { date: "2026-01-01", balance: 80000 },
      { date: "2026-02-01", balance: 70000 },
      { date: "2026-03-01", balance: 60000 },
    ],
  },
];

export const userProfile: UserProfile = {
  name: "Иван Иванов",
  email: "ivan@example.com",
};

export const familyMembers: FamilyMember[] = [
  { id: "u1", name: "Иван Иванов", role: "owner" },
  { id: "u2", name: "Мария Иванова", role: "admin" },
];

export function formatCurrency(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function getAccountName(accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.name ?? "Неизвестный счет";
}

export function getAccountBalance(accountId: string): number {
  return transactions
    .filter((transaction) => transaction.accountId === accountId)
    .reduce((total, transaction) => {
      if (transaction.type === "income") return total + transaction.amount;
      if (transaction.type === "expense") return total - transaction.amount;
      return total;
    }, 0);
}

export function getTotalBalance(): number {
  return accounts.reduce((total, account) => total + getAccountBalance(account.id), 0);
}

export function getTotalInvestmentsValue(): number {
  return investments.reduce((total, investment) => total + investment.quantity * investment.price, 0);
}

export function getTotalDebt(): number {
  return loans.reduce((total, loan) => total + loan.currentBalance, 0);
}

export function getTotalCapital(): number {
  return getTotalBalance() + getTotalInvestmentsValue() - getTotalDebt();
}

export function getUpcomingWithLoans(): UpcomingExpense[] {
  const loanPayments: UpcomingExpense[] = loans.map((loan) => ({
    id: `loan_${loan.id}`,
    name: `Платеж по кредиту: ${loan.name}`,
    amount: loan.monthlyPayment,
    dueDate: "2026-04-15",
    priority: "high",
    isLoan: true,
  }));

  return [...upcomingExpenses, ...loanPayments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
