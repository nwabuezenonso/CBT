import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 }); // Return null user instead of 401 so frontend doesn't crash/redirect immediately
    }

    const decoded: any = verifyToken(token);
    
    if (!decoded) {
       return NextResponse.json({ user: null }, { status: 200 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId || decoded.id || decoded._id).select('-password');

    if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        createdAt: user.createdAt
    });

  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
