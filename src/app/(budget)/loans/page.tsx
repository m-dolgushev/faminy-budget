import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, loans } from "@/lib/budget/data";

export default function LoansPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Кредиты и долги</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{loan.name}</CardTitle>
                <Badge variant={loan.type === "credit" ? "destructive" : "secondary"}>
                  {loan.type}
                </Badge>
              </div>
              <CardDescription>
                {loan.interestRate}% годовых • {loan.termMonths} мес.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Остаток: {formatCurrency(loan.currentBalance)}</p>
              <p>Ежемесячный платеж: {formatCurrency(loan.monthlyPayment)}</p>
              <p>Старт: {loan.startDate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
