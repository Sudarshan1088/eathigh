import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import scanRoutes from "./routes/scan.routes.js";
import userRoutes from "./routes/user.routes.js";

const PORT = parseInt(process.env.PORT || "5000", 10);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

// ── Global Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(generalLimiter);

// ── Health Check ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/user", userRoutes);

// ── 404 Fallback ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Start Server ───────────────────────────────────────────────────
// ── Start Server ───────────────────────────────────────────────────
// Connect to DB immediately for Vercel cold starts
connectDB().catch(console.error);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 EatHigh API running on http://localhost:${PORT}`);
    console.log(`   CORS origin: ${CLIENT_URL}`);
  });
}

// Export the app for Vercel Serverless
export default app;

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  process.exit(0);
});
