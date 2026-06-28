import * as crypto from "crypto";
import * as cookie from "cookie";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { signSessionToken } from "./auth/session";
import {
  findUserByEmail,
  findUserByVerificationToken,
  findUserByResetToken,
  createUser,
  markEmailVerified,
  setPasswordResetToken,
  updatePasswordHash,
  setEmailVerificationToken,
} from "./queries/users";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./lib/email";

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

const authInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),

  signup: publicQuery
    .input(authInput)
    .mutation(async ({ input }) => {
      try {
        const existing = await findUserByEmail(input.email);
        if (existing) {
          return { success: true };
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await createUser({
          email: input.email,
          passwordHash,
        });
        const verificationToken = generateToken();
        await setEmailVerificationToken(user.id, verificationToken);
        await sendVerificationEmail(input.email, verificationToken);
        return { success: true };
      } catch (err) {
        console.error("[signup error]", err);
        throw new Error(err instanceof Error ? err.message : "Registration failed");
      }
    }),

  login: publicQuery
    .input(authInput)
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new Error("Invalid email or password.");
      }
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid email or password.");
      }
      if (!user.emailVerified) {
        throw new Error("Invalid email or password.");
      }
      const token = await signSessionToken({
        userId: user.id,
        email: user.email,
        sessionVersion: user.sessionVersion,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true };
    }),

  verifyEmail: publicQuery
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const user = await findUserByVerificationToken(input.token);
      if (
        !user ||
        !user.emailVerificationTokenExpires ||
        user.emailVerificationTokenExpires < new Date()
      ) {
        throw new Error("Invalid or expired verification token.");
      }
      await markEmailVerified(user.id);
      return { success: true };
    }),

  resendVerification: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await findUserByEmail(input.email);
      if (user && !user.emailVerified) {
        const token = generateToken();
        await setEmailVerificationToken(user.id, token);
        await sendVerificationEmail(input.email, token);
      }
      return { success: true };
    }),

  forgotPassword: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await findUserByEmail(input.email);
      if (user) {
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await setPasswordResetToken(user.id, token, expiresAt);
        await sendPasswordResetEmail(input.email, token);
      }
      return { success: true };
    }),

  resetPassword: publicQuery
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await findUserByResetToken(input.token);
      if (!user || !user.passwordResetExpires) {
        throw new Error("Invalid or expired reset token.");
      }
      if (user.passwordResetExpires < new Date()) {
        throw new Error("Reset token has expired.");
      }
      const hash = await bcrypt.hash(input.password, 12);
      await updatePasswordHash(user.id, hash);
      return { success: true };
    }),
});
