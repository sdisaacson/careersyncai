import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: required("KIMI_AUTH_URL"),
  kimiOpenUrl: required("KIMI_OPEN_URL"),
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  adminSecretPath: process.env.ADMIN_SECRET_PATH ?? "/admin/login",
  moonshotApiKey: process.env.MOONSHOT_API_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  adminEmails: process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : [],
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  fromEmail: process.env.FROM_EMAIL ?? "",
  baseUrl: required("BASE_URL"),
};
