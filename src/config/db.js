import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seedAdmin } from "../database/seedAdmin.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render persistent disk path (set in Render ENV)
// Local fallback for development
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "../../database.sqlite");

// Schema file (always from project)
const SCHEMA_PATH = path.join(__dirname, "../database/schema.sql");

// Ensure directory exists (important for Render)
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open database
export const db = await open({
  filename: DB_PATH,
  driver: sqlite3.Database,
});

// Load schema
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
await db.exec(schema);

console.log(`✅ SQLite database connected at: ${DB_PATH}`);

// ✅ Seed admin safely (only creates once)
await seedAdmin();
