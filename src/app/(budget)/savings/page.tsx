import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, savings } from "@/lib/budget/data";

export default function SavingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Копилки</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savings.map((goal) => {
          const percent = Math.min(100, (goal.current / goal.target) * 100);
          const Icon = goal.icon;
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {goal.name}
                </CardTitle>
                <CardDescription>Цель: {formatCurrency(goal.target)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={percent} />
                <p className="text-sm">Накоплено: {formatCurrency(goal.current)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
