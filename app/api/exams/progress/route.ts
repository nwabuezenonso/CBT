import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamProgress from '@/models/ExamProgress';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    
    const body = await req.json();
    const { examId, answers, currentQuestionIndex, timeRemaining, startTime } = body;
    const examineeId = decoded.id || decoded._id;

    if (!examId) return NextResponse.json({ message: 'Exam ID required' }, { status: 400 });

    const progress = await ExamProgress.findOneAndUpdate(
      { examId, examineeId },
      { 
        answers, 
        currentQuestionIndex, 
        timeRemaining, 
        startTime, // Optional: might not want to update start time on every save
        lastUpdated: new Date() 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(progress);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded: any = verifyToken(token);
    const examineeId = decoded.id || decoded._id;

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');

    if (!examId) return NextResponse.json({ message: 'Exam ID required' }, { status: 400 });

    const progress = await ExamProgress.findOne({ examId, examineeId });

    if (!progress) return NextResponse.json(null); // No progress found is valid

    return NextResponse.json(progress);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded: any = verifyToken(token);
        const examineeId = decoded.id || decoded._id;
    
        const { searchParams } = new URL(req.url);
        const examId = searchParams.get('examId');
    
        if (!examId) return NextResponse.json({ message: 'Exam ID required' }, { status: 400 });
    
        await ExamProgress.findOneAndDelete({ examId, examineeId });
        return NextResponse.json({ message: 'Progress deleted' });
      } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
}
