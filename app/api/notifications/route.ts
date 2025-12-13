import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    const userId = decoded.id || decoded._id;

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    // Internal use or for admins to create notifications
    try {
        await dbConnect();
        // Auth check...
        
        const body = await req.json();
        const notification = await Notification.create(body);
        return NextResponse.json(notification);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    // Mark as read
    try {
        await dbConnect();
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        
        const body = await req.json();
        const { id } = body;
        
        await Notification.findByIdAndUpdate(id, { read: true });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
