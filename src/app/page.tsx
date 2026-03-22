import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    redirect("/accounts");
  }

  const cookieStore = await cookies();
  const activeBudgetId = cookieStore.get("active_budget_id")?.value;
  redirect(activeBudgetId ? "/accounts" : "/onboarding");
}
