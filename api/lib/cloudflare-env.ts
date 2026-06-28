import type { CloudflareEnv } from "../context";

// Global storage for the current request's Cloudflare environment.
// This is set by the Worker entry point before handling each request.
let currentCloudflareEnv: CloudflareEnv | undefined;

export function setCurrentCloudflareEnv(env: CloudflareEnv) {
  currentCloudflareEnv = env;
}

export function getCurrentCloudflareEnv(): CloudflareEnv | undefined {
  return currentCloudflareEnv;
}
