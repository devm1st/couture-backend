import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

const seedAdmin = async () => {
  const email = "admin@couture.com";

  const existing = await db.get(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existing) {
    console.log("⚠️ Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  await db.run(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)`,
    ["Admin", email, passwordHash]
  );

  console.log("✅ Admin user created");
  process.exit(0);
};

seedAdmin();
