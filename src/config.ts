import path from "node:path";
import { Manifest } from "vite";
import fs from "fs/promises";

export function mustGetenv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`FATAL: Environment variable ${name} is not set!`);
    process.exit(1);
  }
  return value;
}

export async function loadViteManifest(): Promise<Manifest | null> {
  if (NODE_ENV !== "production") {
    return null;
  }

  const manifestPath = path.resolve(
    import.meta.dirname,
    "../client/.vite/manifest.json",
  );

  const json = await fs.readFile(manifestPath, { encoding: "utf-8" });

  return JSON.parse(json) as Manifest;
}

function buildTestDatabaseUrl(connString: string, testDb: string) {
  const parsed = new URL(connString);
  parsed.pathname = `/${testDb}`;
  return String(parsed);
}

export const DATABASE_URL = mustGetenv("DATABASE_URL");
export const TEST_DATABASE_NAME = "gutter_social_test";
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  buildTestDatabaseUrl(DATABASE_URL, TEST_DATABASE_NAME);
export const NODE_ENV = process.env.NODE_ENV || "development";

export const ASSET_MANIFEST = await loadViteManifest();
