"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, useBudget } from "@/components/budget/budget-provider";

export default function UpcomingPage() {
  const { upcomingExpenses, loans } = useBudget();

  const items = useMemo(() => {
    const loanPayments = loans.map((loan) => ({
      id: `loan_${loan.id}`,
      name: `Платеж по кредиту: ${loan.name}`,
      amount: loan.monthlyPayment,
      dueDate: loan.startDate.slice(0, 7) + "-25",
      priority: "high" as const,
      isLoan: true,
    }));
    return [...upcomingExpenses, ...loanPayments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [upcomingExpenses, loans]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Планируемые траты</h1>
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Срок: {item.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(item.amount)}</p>
                <Badge variant={item.priority === "high" ? "destructive" : "outline"}>
                  {item.isLoan ? "Кредит" : item.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
