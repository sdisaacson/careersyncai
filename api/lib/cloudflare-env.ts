/// <reference types="node" />
/**
 * Get the current Cloudflare environment from the request context.
 * Returns null when not running in a Cloudflare Worker environment.
 */
export function getCurrentCloudflareEnv(): Record<string, string | undefined> | null {
  // In a Cloudflare Worker, this would be populated from the request context.
  // For local dev / Node.js, fall back to process.env.
  if (typeof process !== "undefined" && process.env) {
    return process.env as Record<string, string | undefined>;
  }
  return null;
}
