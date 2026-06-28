import { eq, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import type { CloudflareEnv } from "../context";
import { hashToken } from "../auth/token";

function getAdminEmails(cloudflareEnv?: CloudflareEnv): string[] {
  const raw = cloudflareEnv?.ADMIN_EMAILS || (typeof process !== "undefined" ? process.env?.ADMIN_EMAILS : undefined);
  if (!raw) return [];
  return raw.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function findUserById(id: number, cloudflareEnv?: CloudflareEnv) {
  const rows = await getDb(cloudflareEnv)
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string, cloudflareEnv?: CloudflareEnv) {
  const rows = await getDb(cloudflareEnv)
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);
  return rows.at(0);
}

export async function findUserByVerificationToken(token: string, cloudflareEnv?: CloudflareEnv) {
  const hashed = hashToken(token);
  const rows = await getDb(cloudflareEnv)
    .select()
    .from(schema.users)
    .where(eq(schema.users.emailVerificationToken, hashed))
    .limit(1);
  return rows.at(0);
}

export async function findUserByResetToken(token: string, cloudflareEnv?: CloudflareEnv) {
  const hashed = hashToken(token);
  const rows = await getDb(cloudflareEnv)
    .select()
    .from(schema.users)
    .where(eq(schema.users.passwordResetToken, hashed))
    .limit(1);
  return rows.at(0);
}

export async function createUser(data: InsertUser, cloudflareEnv?: CloudflareEnv) {
  const values = { ...data };
  if (values.email) {
    values.email = values.email.toLowerCase();
  }
  if (
    values.role === undefined &&
    values.email &&
    getAdminEmails(cloudflareEnv).includes(values.email)
  ) {
    values.role = "admin";
  }
  const [user] = await getDb(cloudflareEnv)
    .insert(schema.users)
    .values(values)
    .returning({ id: schema.users.id });
  return user;
}

export async function markEmailVerified(userId: number, cloudflareEnv?: CloudflareEnv) {
  await getDb(cloudflareEnv)
    .update(schema.users)
    .set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    })
    .where(eq(schema.users.id, userId));
}

export async function setEmailVerificationToken(
  userId: number,
  token: string,
  cloudflareEnv?: CloudflareEnv,
) {
  const hashed = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await getDb(cloudflareEnv)
    .update(schema.users)
    .set({
      emailVerificationToken: hashed,
      emailVerificationTokenExpires: expiresAt,
    })
    .where(eq(schema.users.id, userId));
}

export async function setPasswordResetToken(
  userId: number,
  token: string,
  expiresAt: Date,
  cloudflareEnv?: CloudflareEnv,
) {
  const hashed = hashToken(token);
  await getDb(cloudflareEnv)
    .update(schema.users)
    .set({
      passwordResetToken: hashed,
      passwordResetExpires: expiresAt,
    })
    .where(eq(schema.users.id, userId));
}

export async function updatePasswordHash(userId: number, hash: string, cloudflareEnv?: CloudflareEnv) {
  await getDb(cloudflareEnv)
    .update(schema.users)
    .set({
      passwordHash: hash,
      passwordResetToken: null,
      passwordResetExpires: null,
      sessionVersion: sql`${schema.users.sessionVersion} + 1`,
    })
    .where(eq(schema.users.id, userId));
}

export async function incrementSessionVersion(userId: number, cloudflareEnv?: CloudflareEnv) {
  await getDb(cloudflareEnv)
    .update(schema.users)
    .set({
      sessionVersion: sql`${schema.users.sessionVersion} + 1`,
    })
    .where(eq(schema.users.id, userId));
}
