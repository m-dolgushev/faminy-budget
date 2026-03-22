"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, useBudget } from "@/components/budget/budget-provider";

const accountTypeLabel: Record<string, string> = {
  card: "Банковский счет",
  cash: "Наличные",
  savings: "Финансовая подушка",
};

export default function AccountsPage() {
  const { accounts, getAccountBalance } = useBudget();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Счета</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = account.icon;
          const balance = getAccountBalance(account.id);
          return (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {account.name}
                </CardTitle>
                <CardDescription>Тип: {accountTypeLabel[account.type]}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">{formatCurrency(balance)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
