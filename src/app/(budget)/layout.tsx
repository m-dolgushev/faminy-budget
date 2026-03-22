import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BudgetHeader, BudgetNavigation } from "@/components/budget/BudgetManager";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function BudgetLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-budget-path") ?? "";

  if (isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const activeBudgetId = cookieStore.get("active_budget_id")?.value;
    if (!activeBudgetId) {
      redirect("/onboarding");
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/onboarding");
    }

    const { data: member } = await supabase
      .from("budget_members")
      .select("id")
      .eq("budget_id", activeBudgetId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!member) {
      redirect("/onboarding");
    }
  }

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
