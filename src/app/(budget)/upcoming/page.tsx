import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getUpcomingWithLoans } from "@/lib/budget/data";

export default function UpcomingPage() {
  const items = getUpcomingWithLoans();

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
