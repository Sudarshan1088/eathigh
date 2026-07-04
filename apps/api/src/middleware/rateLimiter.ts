import rateLimit from "express-rate-limit";

/** General rate limiter: 100 requests per 15 minutes. */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." },
});

/** Scan-specific rate limiter: 20 scans per minute. */
export const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many scan requests. Please wait a moment." },
});

/** Auth rate limiter: 10 attempts per 15 minutes (brute-force protection). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many login attempts. Please try again later." },
});
