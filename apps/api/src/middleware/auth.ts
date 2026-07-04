import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@eathigh/shared";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

/** Extend Express Request to carry authenticated user info. */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware that verifies the JWT from the Authorization header.
 * Attaches `req.user` with `{ userId, email }` on success.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

/**
 * Optional auth — doesn't block the request if no token is present,
 * but attaches user info if a valid token exists.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = decoded;
    } catch {
      // Token invalid — proceed without user context
    }
  }

  next();
}

/** Generate a signed JWT for the given user. */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
