"use client";

import { useMemo, useState } from "react";
import { Calculator, Landmark, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  calculateMonthlyPayment,
  formatCurrency,
  useBudget,
} from "@/components/budget/budget-provider";

type EarlyRepaymentMode = "reduce_term" | "reduce_payment" | "current_month_payment";

function calculateTotalToClose(balance: number, rate: number, months: number) {
  const payment = calculateMonthlyPayment(balance, rate, months);
  return payment * months;
}

export default function LoansPage() {
  const { loans, accounts, makeLoanPayment, applyEarlyRepayment } = useBudget();
  const [selectedAccount, setSelectedAccount] = useState<Record<string, string>>({});
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [earlyAmount, setEarlyAmount] = useState("");
  const [earlyMode, setEarlyMode] = useState<EarlyRepaymentMode>("reduce_term");

  const chartData = useMemo(() => {
    const dates = Array.from(new Set(loans.flatMap((loan) => loan.history.map((point) => point.date)))).sort();
    return dates.map((date) => {
      const point: Record<string, number | string> = { date };
      loans.forEach((loan) => {
        point[loan.name] = loan.history.find((history) => history.date === date)?.balance ?? null;
      });
      return point;
    });
  }, [loans]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Кредиты, рассрочки и долги</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Динамика задолженности
          </CardTitle>
          <CardDescription>График остатка долга по всем обязательствам.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                {loans.map((loan, index) => (
                  <Area
                    key={loan.id}
                    type="monotone"
                    dataKey={loan.name}
                    stackId="1"
                    stroke={`hsl(${index * 60}, 70%, 45%)`}
                    fill={`hsl(${index * 60}, 70%, 45%)`}
                    fillOpacity={0.35}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {loans.map((loan) => {
          const percentPaid = ((loan.initialAmount - loan.currentBalance) / loan.initialAmount) * 100;
          const totalToClose = calculateTotalToClose(
            loan.currentBalance,
            loan.interestRate,
            Math.max(1, loan.termMonths)
          );
          const accountId = selectedAccount[loan.id] ?? accounts[0]?.id ?? "";

          return (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{loan.name}</CardTitle>
                  <Badge variant={loan.type === "credit" ? "destructive" : "secondary"}>
                    {loan.type}
                  </Badge>
                </div>
                <CardDescription>
                  {loan.interestRate}% годовых • {loan.termMonths} мес.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Остаток долга</p>
                  <p className="text-xl font-semibold">{formatCurrency(loan.currentBalance)}</p>
                  <Progress value={Math.max(0, Math.min(100, percentPaid))} className="mt-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Выплачено: {percentPaid.toFixed(1)}%
                  </p>
                </div>

                <div className="rounded-md border p-3 text-sm">
                  <p>Минимальный платеж: {formatCurrency(loan.monthlyPayment)}</p>
                  <p>Оценка полного закрытия: {formatCurrency(totalToClose)}</p>
                </div>

                <div className="grid gap-2">
                  <Label>Счет для платежа</Label>
                  <Select
                    value={accountId}
                    onValueChange={(value) =>
                      setSelectedAccount((prev) => ({
                        ...prev,
                        [loan.id]: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите счет" />
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

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => makeLoanPayment(loan.id, accountId)}
                    disabled={loan.currentBalance <= 0 || !accountId}
                  >
                    <Landmark className="mr-2 h-4 w-4" />
                    Оплатить месяц
                  </Button>

                  <Dialog
                    open={selectedLoanId === loan.id}
                    onOpenChange={(open) => {
                      setSelectedLoanId(open ? loan.id : null);
                      if (!open) {
                        setEarlyAmount("");
                        setEarlyMode("reduce_term");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={loan.currentBalance <= 0}>
                        <Calculator className="mr-2 h-4 w-4" />
                        Досрочно
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Досрочное погашение</DialogTitle>
                        <DialogDescription>
                          Выберите сумму и вариант пересчета кредита.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-3 py-2">
                        <div className="space-y-1">
                          <Label>Сумма</Label>
                          <Input
                            type="number"
                            value={earlyAmount}
                            onChange={(event) => setEarlyAmount(event.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Режим</Label>
                          <Select
                            value={earlyMode}
                            onValueChange={(value: EarlyRepaymentMode) => setEarlyMode(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reduce_term">Сократить срок</SelectItem>
                              <SelectItem value="reduce_payment">Снизить ежемесячный платеж</SelectItem>
                              <SelectItem value="current_month_payment">
                                Снизить платеж только в этом месяце
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          onClick={() => {
                            applyEarlyRepayment(loan.id, Number(earlyAmount), earlyMode);
                            setSelectedLoanId(null);
                            setEarlyAmount("");
                          }}
                        >
                          Применить
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
