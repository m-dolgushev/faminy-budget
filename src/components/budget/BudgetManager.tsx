import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, getTotalCapital } from "@/lib/budget/data";
import {
  CalendarClock,
  Landmark,
  PiggyBank,
  ReceiptText,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";

export const budgetRoutes = [
  { href: "/accounts", title: "Счета", Icon: Wallet },
  { href: "/transactions", title: "Операции", Icon: ReceiptText },
  { href: "/loans", title: "Кредиты", Icon: Landmark },
  { href: "/savings", title: "Копилки", Icon: PiggyBank },
  { href: "/investments", title: "Инвестиции", Icon: TrendingUp },
  { href: "/upcoming", title: "Планы", Icon: CalendarClock },
  { href: "/settings", title: "Настройки", Icon: Settings },
] as const;

interface BudgetNavigationProps {
  currentPath?: string;
}

export function BudgetNavigation({ currentPath }: BudgetNavigationProps) {
  return (
    <nav className="grid gap-2 md:grid-cols-7">
      {budgetRoutes.map((route) => (
        <Button
          key={route.href}
          asChild
          variant={currentPath === route.href ? "default" : "outline"}
          className={cn("justify-start gap-2 md:justify-center")}
        >
          <Link href={route.href}>
            <route.Icon className="h-4 w-4" />
            {route.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export function BudgetHeader() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Общий капитал</CardDescription>
        <CardTitle className="text-2xl">{formatCurrency(getTotalCapital())}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
      </CardContent>
    </Card>
  );
}
