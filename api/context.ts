import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./auth/authenticate";

export type CloudflareEnv = {
  APP_SECRET?: string;
  DATABASE_URL?: string;
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
  MOONSHOT_API_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  APP_ID?: string;
  BASE_URL?: string;
  ADMIN_SECRET_PATH?: string;
  ADMIN_EMAILS?: string;
  NODE_ENV?: string;
  [key: string]: string | undefined;
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  cloudflareEnv?: CloudflareEnv;
};

export function createContextFactory(cloudflareEnv: CloudflareEnv) {
  return async function createContext(
    opts: FetchCreateContextFnOptions,
  ): Promise<TrpcContext> {
    const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders, cloudflareEnv };
    try {
      ctx.user = await authenticateRequest(opts.req.headers);
    } catch {
      // Authentication is optional here
    }
    return ctx;
  };
}
