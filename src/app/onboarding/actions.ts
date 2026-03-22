"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type OnboardingActionState = {
  error?: string;
};

function buildInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createBudgetAction(
  _: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase не настроен. Добавьте переменные окружения." };
  }

  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "Введите название бюджета." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Требуется авторизация." };
  }

  const { data, error } = await supabase.rpc("create_budget_with_owner", {
    p_name: name,
    p_currency: "RUB",
  });
  if (error || !data) {
    return {
      error:
        error?.message ??
        "Не удалось создать бюджет. Проверьте SQL RPC create_budget_with_owner.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("active_budget_id", data, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");
  redirect("/accounts");
}

export async function joinBudgetAction(
  _: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase не настроен. Добавьте переменные окружения." };
  }

  const code = formData.get("code")?.toString().trim().toUpperCase();
  if (!code) return { error: "Введите код приглашения." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Требуется авторизация." };
  }

  const { data, error } = await supabase.rpc("join_budget_by_code", { p_code: code });
  if (error || !data) {
    return {
      error:
        error?.message ??
        "Не удалось присоединиться по коду. Проверьте SQL RPC и корректность кода.",
    };
  }

  const budgetId = Array.isArray(data) ? data[0]?.budget_id : data.budget_id;
  if (!budgetId) {
    return { error: "RPC join_budget_by_code не вернул budget_id." };
  }

  const cookieStore = await cookies();
  cookieStore.set("active_budget_id", budgetId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/", "layout");
  redirect("/accounts");
}

export async function createInviteAction(budgetId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase не настроен.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Требуется авторизация.");
  }

  const code = buildInviteCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const { data, error } = await supabase
    .from("budget_invites")
    .insert({
      budget_id: budgetId,
      code,
      expires_at: expiresAt,
      max_uses: 20,
      used_count: 0,
      created_by: user.id,
    })
    .select("code, expires_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Не удалось создать инвайт.");
  }

  return data;
}
