import { Resend } from "resend";
import { env } from "./env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

function buildUrl(path: string, token: string) {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:5173";
  const url = new URL(path, baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = buildUrl("/verify-email", token);
  if (!resend || !env.fromEmail) {
    console.log(`[email] Verification link for ${to}: ${link}`);
    return { success: true };
  }
  await resend.emails.send({
    from: env.fromEmail,
    to,
    subject: "Verify your email",
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  });
  return { success: true };
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = buildUrl("/reset-password", token);
  if (!resend || !env.fromEmail) {
    console.log(`[email] Password reset link for ${to}: ${link}`);
    return { success: true };
  }
  await resend.emails.send({
    from: env.fromEmail,
    to,
    subject: "Reset your password",
    html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
  return { success: true };
}
