import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { verifySessionToken } from "./session";
import { findUserById } from "../queries/users";
import type { CloudflareEnv } from "../context";

export async function authenticateRequest(headers: Headers, cloudflareEnv?: CloudflareEnv) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const claim = await verifySessionToken(token, cloudflareEnv);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  const user = await findUserById(claim.userId, cloudflareEnv);
  if (!user || !user.emailVerified) {
    throw Errors.forbidden("User not found or email not verified.");
  }
  if (user.sessionVersion !== claim.sessionVersion) {
    throw Errors.forbidden("Invalid authentication token.");
  }
  return user;
}
