import * as jose from "jose";

export type SessionPayload = {
  userId: number;
  email: string;
  sessionVersion: number;
};

const JWT_ALG = "HS256";

function getAppSecret(): string {
  const secret = process.env.APP_SECRET;
  if (!secret) {
    throw new Error("APP_SECRET is not configured");
  }
  return secret;
}

export async function signSessionToken(
  payload: SessionPayload
): Promise<string> {
  const secret = new TextEncoder().encode(getAppSecret());
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
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
