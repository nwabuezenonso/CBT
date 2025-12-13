import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth Check
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    // Ideally we verify and get user ID
    // simplified for now: assume middleware handles or we verify here
    // In a real app, use a proper session wrapper
    // For now, let's just create.
    const decoded = verifyToken(token);
    // @ts-ignore
    if (!decoded || decoded.role !== 'examiner') {
      return NextResponse.json({ message: 'Forbidden: Examiners only' }, { status: 403 });
    }

    const body = await req.json();
    
    const exam = await Exam.create({
      ...body,
      // @ts-ignore
      examinerId: decoded.id,
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const role = url.searchParams.get('role'); // e.g. ?role=examiner&userId=...
    
    // In real app, filter by logged in user
    // For now, just return all for simplicity or public ones
    const exams = await Exam.find({ status: { $ne: 'archived' } }).sort({ createdAt: -1 });

    return NextResponse.json(exams);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
