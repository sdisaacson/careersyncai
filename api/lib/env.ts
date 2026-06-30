import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  // In Cloudflare Workers, env vars are injected at runtime, not build time.
  // Don't throw during bundling — only throw when the value is actually used at runtime.
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  adminSecretPath: process.env.ADMIN_SECRET_PATH ?? "/admin/login",
  moonshotApiKey: process.env.MOONSHOT_API_KEY ?? "",
  // AI Gateway can authenticate via Vercel OIDC automatically on Vercel, or via
  // AI_GATEWAY_API_KEY for local/standalone usage.
  aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  adminEmails: process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",")
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)
    : [],
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  fromEmail: process.env.FROM_EMAIL ?? "",
  baseUrl: required("BASE_URL"),
};
