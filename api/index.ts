// Vercel Serverless Function entry point
// This thin wrapper re-exports the Express app so Vercel can detect it
// as a serverless function from the root api/ directory.
import app from "../apps/api/src/index.js";

export default app;
