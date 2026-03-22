"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type {
  Account,
  FamilyMember,
  Investment,
  Loan,
  SavingGoal,
  Transaction,
  TransactionCategory,
  TransactionType,
  UpcomingExpense,
  UserProfile,
} from "@/lib/budget/types";
import {
  accounts as initialAccounts,
  familyMembers as initialFamilyMembers,
  formatCurrency,
  investments as initialInvestments,
  loans as initialLoans,
  savings as initialSavings,
  transactions as initialTransactions,
  upcomingExpenses as initialUpcomingExpenses,
  userProfile as initialUserProfile,
} from "@/lib/budget/data";

type EarlyRepaymentMode = "reduce_term" | "reduce_payment" | "current_month_payment";

type BudgetContextValue = {
  accounts: Account[];
  transactions: Transaction[];
  savings: SavingGoal[];
  investments: Investment[];
  loans: Loan[];
  upcomingExpenses: UpcomingExpense[];
  userProfile: UserProfile;
  familyMembers: FamilyMember[];
  totalBalance: number;
  totalInvestmentsValue: number;
  totalDebt: number;
  totalCapital: number;
  getAccountBalance: (accountId: string) => number;
  getAccountName: (accountId: string) => string;
  addTransaction: (payload: {
    type: Exclude<TransactionType, "transfer">;
    accountId: string;
    amount: number;
    category: TransactionCategory;
    description: string;
    date: string;
  }) => void;
  transferBetweenAccounts: (payload: {
    fromId: string;
    toId: string;
    amount: number;
    date: string;
  }) => void;
  updateSaving: (savingId: string, amountDelta: number) => void;
  updateInvestmentPrice: (investmentId: string, price: number) => void;
  makeLoanPayment: (loanId: string, accountId: string) => void;
  applyEarlyRepayment: (loanId: string, amount: number, mode: EarlyRepaymentMode) => void;
  updateProfile: (profile: UserProfile) => void;
  addFamilyMember: (name: string) => void;
  removeFamilyMember: (memberId: string) => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function calculateMonthlyPayment(principal: number, annualRate: number, months: number) {
  if (months <= 0) return principal;
  if (annualRate <= 0) return principal / months;
  const rate = annualRate / 1200;
  const pow = Math.pow(1 + rate, months);
  return (principal * rate * pow) / (pow - 1);
}

function estimateRemainingTerm(balance: number, payment: number, annualRate: number) {
  if (balance <= 0 || payment <= 0) return 0;
  if (annualRate <= 0) return Math.ceil(balance / payment);
  const rate = annualRate / 1200;
  const n = -Math.log(1 - (balance * rate) / payment) / Math.log(1 + rate);
  return Number.isFinite(n) ? Math.max(1, Math.ceil(n)) : 1;
}

export function BudgetProvider({ children }: PropsWithChildren) {
  const [accounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [savings, setSavings] = useState<SavingGoal[]>(initialSavings);
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [upcomingExpenses] = useState<UpcomingExpense[]>(initialUpcomingExpenses);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);

  const getAccountBalance = (accountId: string) =>
    transactions
      .filter((transaction) => transaction.accountId === accountId)
      .reduce((total, transaction) => {
        if (transaction.type === "income") return total + transaction.amount;
        if (transaction.type === "expense") return total - transaction.amount;
        return total;
      }, 0);

  const getAccountName = (accountId: string) =>
    accounts.find((account) => account.id === accountId)?.name ?? "Неизвестный счет";

  const addTransaction: BudgetContextValue["addTransaction"] = (payload) => {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ...payload,
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const transferBetweenAccounts: BudgetContextValue["transferBetweenAccounts"] = ({
    fromId,
    toId,
    amount,
    date,
  }) => {
    const fromName = getAccountName(fromId);
    const toName = getAccountName(toId);
    const description = `Перевод: ${fromName} → ${toName}`;

    const outTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: "expense",
      accountId: fromId,
      amount,
      date,
      category: "transfer",
      description,
    };

    const inTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: "income",
      accountId: toId,
      amount,
      date,
      category: "transfer",
      description,
    };

    setTransactions((prev) => [outTransaction, inTransaction, ...prev]);
  };

  const updateSaving: BudgetContextValue["updateSaving"] = (savingId, amountDelta) => {
    setSavings((prev) =>
      prev.map((saving) =>
        saving.id === savingId ? { ...saving, current: Math.max(0, saving.current + amountDelta) } : saving
      )
    );
  };

  const updateInvestmentPrice: BudgetContextValue["updateInvestmentPrice"] = (
    investmentId,
    price
  ) => {
    const today = getToday();
    setInvestments((prev) =>
      prev.map((investment) =>
        investment.id === investmentId
          ? {
              ...investment,
              price,
              history: [...investment.history, { date: today, price }],
            }
          : investment
      )
    );
  };

  const makeLoanPayment: BudgetContextValue["makeLoanPayment"] = (loanId, accountId) => {
    const loan = loans.find((item) => item.id === loanId);
    if (!loan) return;

    const interestPart = loan.currentBalance * (loan.interestRate / 1200);
    const principalPart = Math.max(0, loan.monthlyPayment - interestPart);
    const newBalance = Math.max(0, loan.currentBalance - principalPart);
    const today = getToday();

    setLoans((prev) =>
      prev.map((item) =>
        item.id === loanId
          ? {
              ...item,
              currentBalance: newBalance,
              history: [...item.history, { date: today, balance: newBalance }],
            }
          : item
      )
    );

    addTransaction({
      type: "expense",
      accountId,
      amount: loan.monthlyPayment,
      category: "loan_payment",
      description: `Платеж по кредиту: ${loan.name}`,
      date: today,
    });
  };

  const applyEarlyRepayment: BudgetContextValue["applyEarlyRepayment"] = (
    loanId,
    amount,
    mode
  ) => {
    if (amount <= 0) return;
    const today = getToday();

    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId) return loan;

        const newBalance = Math.max(0, loan.currentBalance - amount);
        let nextMonthlyPayment = loan.monthlyPayment;
        let nextTermMonths = loan.termMonths;

        if (mode === "reduce_term") {
          nextTermMonths = estimateRemainingTerm(newBalance, loan.monthlyPayment, loan.interestRate);
        } else if (mode === "reduce_payment") {
          nextMonthlyPayment = calculateMonthlyPayment(newBalance, loan.interestRate, loan.termMonths);
        } else if (mode === "current_month_payment") {
          nextMonthlyPayment = Math.max(0, loan.monthlyPayment - amount);
        }

        return {
          ...loan,
          currentBalance: newBalance,
          termMonths: nextTermMonths,
          monthlyPayment: nextMonthlyPayment,
          history: [...loan.history, { date: today, balance: newBalance }],
        };
      })
    );
  };

  const updateProfile = (profile: UserProfile) => setUserProfile(profile);

  const addFamilyMember = (name: string) => {
    const nextName = name.trim();
    if (!nextName) return;
    setFamilyMembers((prev) => [...prev, { id: crypto.randomUUID(), name: nextName, role: "viewer" }]);
  };

  const removeFamilyMember = (memberId: string) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== memberId || member.role === "owner"));
  };

  const totalBalance = useMemo(
    () => accounts.reduce((total, account) => total + getAccountBalance(account.id), 0),
    [accounts, transactions]
  );

  const totalInvestmentsValue = useMemo(
    () =>
      investments.reduce((total, investment) => total + investment.quantity * investment.price, 0),
    [investments]
  );

  const totalDebt = useMemo(
    () => loans.reduce((total, loan) => total + loan.currentBalance, 0),
    [loans]
  );

  const value: BudgetContextValue = {
    accounts,
    transactions,
    savings,
    investments,
    loans,
    upcomingExpenses,
    userProfile,
    familyMembers,
    totalBalance,
    totalInvestmentsValue,
    totalDebt,
    totalCapital: totalBalance + totalInvestmentsValue - totalDebt,
    getAccountBalance,
    getAccountName,
    addTransaction,
    transferBetweenAccounts,
    updateSaving,
    updateInvestmentPrice,
    makeLoanPayment,
    applyEarlyRepayment,
    updateProfile,
    addFamilyMember,
    removeFamilyMember,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within BudgetProvider");
  }
  return context;
}

export { formatCurrency, calculateMonthlyPayment };
