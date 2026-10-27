import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import mongoose from "mongoose";

const [name, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

if (!name?.trim() || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Usage: node --env-file=.env.local scripts/create-admin.mjs <name> <email>");
}
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

try {
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || "test",
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 1,
  });
  const db = connection.connection.db;
  if (!db) throw new Error("MongoDB connection is unavailable");
  const admins = db.collection("admins");
  const password = randomBytes(24).toString("base64url");
  const passwordHash = await hash(password, 12);
  const result = await admins.updateOne(
    { email },
    { $setOnInsert: { name: name.trim(), email, password: passwordHash, isActive: true } },
    { upsert: true },
  );

  if (result.upsertedCount !== 1) {
    throw new Error("An admin with this email already exists. No credentials were changed.");
  }

  // This is the only time the generated password is available in plaintext.
  process.stdout.write(JSON.stringify({ name: name.trim(), email, password }) + "\n");
} finally {
  await mongoose.disconnect();
}
