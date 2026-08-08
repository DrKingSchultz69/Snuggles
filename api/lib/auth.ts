import { verifyToken } from '@clerk/backend';
import type { NextFunction, Request, Response } from 'express';

// Set by the middleware below once a Clerk session token checks out.
export interface AuthedRequest extends Request {
  userId?: string;
}

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

/**
 * Verifies a Clerk session token and returns the user ID, or null.
 *
 * Clerk session tokens are short-lived JWTs signed by Clerk. verifyToken
 * checks the signature and expiry against our secret key, so a client cannot
 * hand us an arbitrary user ID — the ID always comes out of a token Clerk
 * itself issued.
 */
async function userIdFromRequest(req: Request): Promise<string | null> {
  const token = bearerToken(req);
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!token || !secretKey) return null;

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload.sub ?? null;
  } catch {
    // Expired or tampered token — treated the same as being signed out.
    return null;
  }
}

/**
 * Attaches req.userId when a valid token is present, and does nothing when it
 * isn't. Used on checkout so guest orders keep working exactly as before.
 */
export async function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  req.userId = (await userIdFromRequest(req)) ?? undefined;
  next();
}

/**
 * Rejects the request with 401 unless a valid token is present. Used on the
 * account endpoints, which are meaningless without a user.
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = await userIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ success: false, error: 'Not signed in' });
    return;
  }
  req.userId = userId;
  next();
}
