import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Unauthorized, access token required' });
      return;
    }
    // Verify token and attach user info to request
    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Forbidden, invalid or expired token' });
    return;
  }
};
