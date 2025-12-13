import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/question';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    // @ts-ignore
    if (!decoded || decoded.role !== 'examiner') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    const question = await Question.create({
      ...body,
      // @ts-ignore
      examinerId: decoded.id,
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    // In a real app, verify token and filter by examiner ID
    const decoded = verifyToken(token);
    
    // @ts-ignore
    const questions = await Question.find({ examinerId: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
