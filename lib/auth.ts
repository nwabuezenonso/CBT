import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export interface JWTPayload {
  userId: string;
  role: string;
  status: string;
  organizationId?: string;
}

export const signToken = (userId: string, role: string, status: string, organizationId?: string) => {
  return jwt.sign(
    { userId, role, status, organizationId },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
