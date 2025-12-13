import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded: any = verifyToken(token);
    
    if (!decoded) {
       // Token invalid - client should clear it or ignore
       return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await User.findById(decoded.id || decoded._id).select('-password');

    if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
