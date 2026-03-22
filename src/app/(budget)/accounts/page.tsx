import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts, formatCurrency, getAccountBalance } from "@/lib/budget/data";

export default function AccountsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Счета</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = account.icon;
          return (
            <Card key={account.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {account.name}
              </CardTitle>
              <CardDescription>Тип: {account.type}</CardDescription>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {formatCurrency(getAccountBalance(account.id))}
            </CardContent>
          </Card>
          );
        })}
      </div>
    </section>
  );
}
