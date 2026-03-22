"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowLeftRight, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, useBudget } from "@/components/budget/budget-provider";
import type { TransactionCategory } from "@/lib/budget/types";

const incomeCategories: TransactionCategory[] = ["salary", "advance", "other"];
const expenseCategories: TransactionCategory[] = [
  "food",
  "utilities",
  "transport",
  "health",
  "entertainment",
  "other",
];

type TransactionForm = {
  accountId: string;
  amount: string;
  category: TransactionCategory;
  description: string;
  date: string;
};

export default function TransactionsPage() {
  const { accounts, transactions, addTransaction, transferBetweenAccounts, getAccountName } = useBudget();
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const initialDate = new Date().toISOString().split("T")[0];
  const [incomeForm, setIncomeForm] = useState<TransactionForm>({
    accountId: accounts[0]?.id ?? "",
    amount: "",
    category: "salary",
    description: "",
    date: initialDate,
  });
  const [expenseForm, setExpenseForm] = useState<TransactionForm>({
    accountId: accounts[0]?.id ?? "",
    amount: "",
    category: "food",
    description: "",
    date: initialDate,
  });
  const [transferForm, setTransferForm] = useState({
    fromId: accounts[0]?.id ?? "",
    toId: accounts[1]?.id ?? accounts[0]?.id ?? "",
    amount: "",
    date: initialDate,
  });

  const submitIncome = () => {
    if (!incomeForm.accountId || !incomeForm.amount) return;
    addTransaction({
      type: "income",
      accountId: incomeForm.accountId,
      amount: Number(incomeForm.amount),
      category: incomeForm.category,
      description: incomeForm.description || "Доход",
      date: incomeForm.date,
    });
    setIncomeForm((prev) => ({ ...prev, amount: "", description: "" }));
    setIncomeOpen(false);
  };

  const submitExpense = () => {
    if (!expenseForm.accountId || !expenseForm.amount) return;
    addTransaction({
      type: "expense",
      accountId: expenseForm.accountId,
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      description: expenseForm.description || "Расход",
      date: expenseForm.date,
    });
    setExpenseForm((prev) => ({ ...prev, amount: "", description: "" }));
    setExpenseOpen(false);
  };

  const submitTransfer = () => {
    if (!transferForm.fromId || !transferForm.toId || !transferForm.amount) return;
    if (transferForm.fromId === transferForm.toId) return;
    transferBetweenAccounts({
      fromId: transferForm.fromId,
      toId: transferForm.toId,
      amount: Number(transferForm.amount),
      date: transferForm.date,
    });
    setTransferForm((prev) => ({ ...prev, amount: "" }));
    setTransferOpen(false);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Операции</h1>

      <div className="grid gap-3 md:grid-cols-3">
        <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
          <DialogTrigger asChild>
            <Button className="justify-start gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Добавить доход
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Регистрация дохода</DialogTitle>
              <DialogDescription>Создайте запись поступления средств.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>Счет</Label>
                <Select
                  value={incomeForm.accountId}
                  onValueChange={(value) => setIncomeForm((prev) => ({ ...prev, accountId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Категория</Label>
                <Select
                  value={incomeForm.category}
                  onValueChange={(value: TransactionCategory) =>
                    setIncomeForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Сумма</Label>
                  <Input
                    type="number"
                    value={incomeForm.amount}
                    onChange={(event) => setIncomeForm((prev) => ({ ...prev, amount: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Дата</Label>
                  <Input
                    type="date"
                    value={incomeForm.date}
                    onChange={(event) => setIncomeForm((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Описание</Label>
                <Input
                  value={incomeForm.description}
                  onChange={(event) => setIncomeForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitIncome}>Сохранить доход</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="justify-start gap-2">
              <ArrowDownCircle className="h-4 w-4" />
              Добавить расход
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Регистрация расхода</DialogTitle>
              <DialogDescription>Создайте запись списания средств.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>Счет</Label>
                <Select
                  value={expenseForm.accountId}
                  onValueChange={(value) => setExpenseForm((prev) => ({ ...prev, accountId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Категория</Label>
                <Select
                  value={expenseForm.category}
                  onValueChange={(value: TransactionCategory) =>
                    setExpenseForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Сумма</Label>
                  <Input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(event) => setExpenseForm((prev) => ({ ...prev, amount: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Дата</Label>
                  <Input
                    type="date"
                    value={expenseForm.date}
                    onChange={(event) => setExpenseForm((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Описание</Label>
                <Input
                  value={expenseForm.description}
                  onChange={(event) => setExpenseForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitExpense}>Сохранить расход</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Перевод между счетами
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Перевод между счетами</DialogTitle>
              <DialogDescription>Перемещение средств с одного счета на другой.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Откуда</Label>
                  <Select
                    value={transferForm.fromId}
                    onValueChange={(value) => setTransferForm((prev) => ({ ...prev, fromId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Куда</Label>
                  <Select
                    value={transferForm.toId}
                    onValueChange={(value) => setTransferForm((prev) => ({ ...prev, toId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Сумма</Label>
                  <Input
                    type="number"
                    value={transferForm.amount}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, amount: event.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Дата</Label>
                  <Input
                    type="date"
                    value={transferForm.date}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitTransfer}>Выполнить перевод</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Счет</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">
                  {transaction.type === "expense" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
