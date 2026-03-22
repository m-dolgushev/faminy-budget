import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function readValue(name) {
  const direct = process.env[name];
  if (direct && direct.trim().length > 0) return direct.trim();

  const fromFile = process.env[`${name}_FILE`];
  if (!fromFile) return "";
  if (!existsSync(fromFile)) return "";
  return readFileSync(fromFile, "utf8").trim();
}

const values = Object.fromEntries(required.map((name) => [name, readValue(name)]));
const missing = required.filter((name) => !values[name]);

if (missing.length > 0) {
  console.error(`Missing required vars: ${missing.join(", ")}`);
  process.exit(1);
}

const envBody = `${required.map((name) => `${name}=${values[name]}`).join("\n")}\n`;
const output = resolve(process.cwd(), ".env.local");
writeFileSync(output, envBody, "utf8");
console.log(`Generated ${output}`);
