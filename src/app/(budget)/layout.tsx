import type { ReactNode } from "react";
import { headers } from "next/headers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BudgetHeader, BudgetNavigation } from "@/components/budget/BudgetManager";

export default async function BudgetLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-budget-path") ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container space-y-6 py-6">
        <BudgetHeader />
        <BudgetNavigation currentPath={pathname} />
        {children}
      </main>
      <Footer />
    </div>
  );
}
