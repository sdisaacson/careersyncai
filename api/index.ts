import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../server/lib/api/app.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || "/", `https://${req.headers.host}`);

  const request = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(
      Object.entries(req.headers).flatMap(([k, v]) => {
        if (v === undefined) return [];
        if (Array.isArray(v)) return v.map(val => [k, val]);
        return [[k, String(v)]];
      }) as [string, string][]
    ),
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
  });

  const response = await app.fetch(request);

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = await response.text();
  res.send(body);
}
