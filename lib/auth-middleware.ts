import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export interface JWTPayload {
  userId: string;
  role: string;
  status: string;
  organizationId?: string;
  [key: string]: any;
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log('[verifyTokenEdge] Token verified successfully:', payload);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('[verifyTokenEdge] Token verification failed:', error);
    return null;
  }
}
