import "server-only";
import { existsSync, readFileSync } from "node:fs";

function readEnv(name: string): string | undefined {
  const direct = process.env[name];
  if (direct && direct.trim().length > 0) {
    return direct.trim();
  }

  const filePath = process.env[`${name}_FILE`];
  if (!filePath) return undefined;
  if (!existsSync(filePath)) return undefined;

  const fromFile = readFileSync(filePath, "utf8").trim();
  return fromFile.length > 0 ? fromFile : undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function getSupabaseEnv() {
  const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase env is not configured. Set NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY or *_FILE variants."
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export function getSupabaseServiceRoleKey() {
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Set it directly or via SUPABASE_SERVICE_ROLE_KEY_FILE."
    );
  }
  return key;
}
