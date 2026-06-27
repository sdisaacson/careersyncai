import { eq, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";
import { hashToken } from "../auth/token";

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);
  return rows.at(0);
}

export async function findUserByVerificationToken(token: string) {
  const hashed = hashToken(token);
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.emailVerificationToken, hashed))
    .limit(1);
  return rows.at(0);
}

export async function findUserByResetToken(token: string) {
  const hashed = hashToken(token);
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.passwordResetToken, hashed))
    .limit(1);
  return rows.at(0);
}

export async function createUser(data: InsertUser) {
  const values = { ...data };
  if (values.email) {
    values.email = values.email.toLowerCase();
  }
  if (
    values.role === undefined &&
    values.email &&
    env.adminEmails.includes(values.email)
  ) {
    values.role = "admin";
  }
  const [user] = await getDb()
    .insert(schema.users)
    .values(values)
    .returning({ id: schema.users.id });
  return user;
}

export async function markEmailVerified(userId: number) {
  await getDb()
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
) {
  const hashed = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await getDb()
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
) {
  const hashed = hashToken(token);
  await getDb()
    .update(schema.users)
    .set({
      passwordResetToken: hashed,
      passwordResetExpires: expiresAt,
    })
    .where(eq(schema.users.id, userId));
}

export async function updatePasswordHash(userId: number, hash: string) {
  await getDb()
    .update(schema.users)
    .set({
      passwordHash: hash,
      passwordResetToken: null,
      passwordResetExpires: null,
      sessionVersion: sql`${schema.users.sessionVersion} + 1`,
    })
    .where(eq(schema.users.id, userId));
}

export async function incrementSessionVersion(userId: number) {
  await getDb()
    .update(schema.users)
    .set({
      sessionVersion: sql`${schema.users.sessionVersion} + 1`,
    })
    .where(eq(schema.users.id, userId));
}
