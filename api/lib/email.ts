import { Resend } from "resend";
import { env } from "./env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

function buildUrl(path: string, token: string) {
  const url = new URL(path, env.baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
  description: string;
  fallbackLink: string;
}) {
  if (!resend || !env.fromEmail) {
    if (env.isProduction) {
      throw new Error(`Email cannot be sent in production: ${args.description}`);
    }
    console.log(`[email] ${args.description} for ${args.to}: ${args.fallbackLink}`);
    return { success: true };
  }
  const { error } = await resend.emails.send({
    from: env.fromEmail,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
  if (error) {
    throw error;
  }
  return { success: true };
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = buildUrl("/verify-email", token);
  return sendEmail({
    to,
    subject: "Verify your email",
    html: `<p><a href="${link}">Verify your email</a></p><p>Or copy this link: ${link}</p>`,
    text: `Verify your email: ${link}`,
    description: "Verification link",
    fallbackLink: link,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = buildUrl("/reset-password", token);
  return sendEmail({
    to,
    subject: "Reset your password",
    html: `<p><a href="${link}">Reset your password</a></p><p>Or copy this link: ${link}</p><p>This link expires in 1 hour.</p>`,
    text: `Reset your password (expires in 1 hour): ${link}`,
    description: "Password reset link",
    fallbackLink: link,
  });
}
