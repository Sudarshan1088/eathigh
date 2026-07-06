// Vercel Serverless Function entry point.
// Wraps the Express app import in error handling so we can debug crashes.
import type { VercelRequest, VercelResponse } from "@vercel/node";

let app: any;
let initError: Error | null = null;

try {
  const mod = await import("../apps/api/src/index");
  app = mod.default;
} catch (err: any) {
  initError = err;
  console.error("Failed to load API module:", err);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (initError) {
    return res.status(500).json({
      error: "API module failed to load",
      message: initError.message,
      stack: initError.stack,
    });
  }
  return app(req, res);
}
