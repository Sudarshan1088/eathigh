// Vercel Serverless Function entry point.
// @vercel/node auto-detects this file and wraps it as a serverless function.
// It re-exports the Express app so all /api/* traffic is handled by Express.
import app from "../apps/api/src/index";

export default app;
