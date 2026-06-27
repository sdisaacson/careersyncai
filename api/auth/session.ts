import * as jose from "jose";
import { env } from "../lib/env";

export type SessionPayload = {
  userId: number;
  email: string;
  sessionVersion: number;
};

const JWT_ALG = "HS256";

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
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
    const secret = new TextEncoder().encode(env.appSecret);
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
