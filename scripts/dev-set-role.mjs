import { MongoClient } from "mongodb";
import fs from "node:fs";

// Load local environment if not set
if (!process.env.DB_NAME || !process.env.MONGODB_URI) {
  try {
    const envLocal = fs.readFileSync(".env.local", "utf8");
    for (const line of envLocal.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) process.env[k] = v;
      }
    }
  } catch {
    // Ignore missing .env.local
  }
}

const dbName = process.env.DB_NAME;
const uri = process.env.MONGODB_URI;

if (dbName !== "equipra_dev") {
  console.error("Refusing to run: DB_NAME must be 'equipra_dev'. Never run against production.");
  process.exit(1);
}

if (!uri) {
  console.error("Refusing to run: MONGODB_URI is not set.");
  process.exit(1);
}

const args = process.argv.slice(2);
const email = args[0]?.trim();
const role = args[1]?.trim().toLowerCase();

const VALID_ROLES = ["customer", "owner", "admin"];

if (!email || !role || !VALID_ROLES.includes(role)) {
  console.error("Usage: node scripts/dev-set-role.mjs <email> <customer|owner|admin>");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("user").updateOne(
      { email },
      { $set: { role, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      console.error(`User with email "${email}" not found in ${dbName}.`);
      process.exit(1);
    }

    console.log(`Successfully updated role for ${email} to "${role}" in ${dbName}.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Operation failed:", err.message);
  process.exit(1);
});
