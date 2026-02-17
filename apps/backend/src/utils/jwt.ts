import { SignJWT, jwtVerify, decodeJwt, type JWTPayload } from 'jose';
import { createSecretKey } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload extends JWTPayload {
  id: string;
  email: string;
}

export const generateToken = async (payload: JwtPayload): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const secretKey = createSecretKey(secret, 'utf-8');

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN! || '7d')
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(process.env.JWT_SECRET!, 'utf-8');
  const { payload } = await jwtVerify(token, secretKey);

  return {
    id: payload.id as string,
    email: payload.email as string,
    username: payload.username as string,
  };
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const payload = decodeJwt(token);
    return {
      id: payload.id as string,
      email: payload.email as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
};
