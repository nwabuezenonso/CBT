import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/question';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const question = await Question.findByIdAndUpdate(params.id, body, { new: true });

    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const question = await Question.findByIdAndDelete(params.id);

    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });

    return NextResponse.json({ message: 'Question deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
