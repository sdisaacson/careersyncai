import * as jose from "jose";
import { getCurrentCloudflareEnv } from "../lib/cloudflare-env";

export type SessionPayload = {
  userId: number;
  email: string;
  sessionVersion: number;
};

const JWT_ALG = "HS256";

function getAppSecret(): string {
  const env = getCurrentCloudflareEnv();
  // In Cloudflare Workers, use the env binding
  if (env?.APP_SECRET) {
    return env.APP_SECRET;
  }
  // Fallback to process.env for local Node.js development
  if (typeof process !== "undefined" && process.env?.APP_SECRET) {
    return process.env.APP_SECRET;
  }
  throw new Error("APP_SECRET is not configured");
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(getAppSecret());
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(getAppSecret());
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    const { userId, email, sessionVersion } = payload;
    if (!userId || !email || sessionVersion === undefined) {
      return null;
    }
    return {
      userId: Number(userId),
      email: String(email),
      sessionVersion: Number(sessionVersion),
    };
  } catch {
    return null;
  }
}
