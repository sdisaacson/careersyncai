import { serve } from "@hono/node-server";
import app from "./boot.js";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
