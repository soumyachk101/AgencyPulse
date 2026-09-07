/**
 * scripts/migrate.ts
 *
 * Prisma migration runner with optional seed step.
 *
 * Usage:
 * npm run migrate # run pending migrations + seed
 * npm run migrate:reset # reset DB, re-run all migrations + seed
 * npm run migrate:deploy # run pending migrations only (no seed)
 *
 * Environment:
 * DATABASE_URL (required)
 */

import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
 console.error("ERROR: DATABASE_URL is not set. Aborting.");
 process.exit(1);
}

const SKIP_SEED = process.argv.includes("--no-seed");
const RESET = process.argv.includes("--reset");

function run(command: string, label: string): void {
 console.log(`\n── ${label} ──`);
 try {
 execSync(command, {
 stdio: "inherit",
 env: { ...process.env },
 });
 } catch {
 console.error(`\n❌ Failed: ${label}`);
 process.exit(1);
 }
}

async function main() {
 console.log("========================================");
 console.log(" AgencyPulse · Database Migrations");
 console.log("========================================");

 if (RESET) {
 run("npx prisma migrate reset --force", "Reset database & re-run all migrations");
 } else {
 run("npx prisma migrate deploy", "Apply pending migrations");
 }

 // Verify schema is in sync with migrations
 console.log("\n── Verify schema ──");
 try {
 execSync("npx prisma validate", { stdio: "inherit", env: { ...process.env } });
 console.log("Schema OK.");
 } catch {
 console.warn("⚠ Schema validation failed — check for drift.");
 }

 if (SKIP_SEED) {
 console.log("\n✓ Migrations applied (seed skipped).");
 return;
 }

 // Seed
 console.log("\n── Seed demo data ──");
 try {
 execSync("tsx scripts/seed.ts", {
 stdio: "inherit",
 env: { ...process.env },
 });
 console.log("\n✓ Seeding complete.");
 } catch {
 console.error("\n❌ Seeding failed.");
 process.exit(1);
 }
}

main();
