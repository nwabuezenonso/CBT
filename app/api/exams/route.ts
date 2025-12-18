import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import ExamQuestion from '@/models/ExamQuestion';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/exams - Create new exam
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      subject,
      duration,
      instructions,
      startTime,
      endTime,
      shuffleQuestions,
      shuffleOptions,
      showResultsImmediately,
      allowReview,
      maxAttempts,
      questions // Array of { questionId, marks }
    } = body;

    if (!title || !subject || !duration || !questions || questions.length === 0) {
      return NextResponse.json(
        { message: 'Please provide title, subject, duration and at least one question.' },
        { status: 400 }
      );
    }

    // 1. Create Exam
    const exam = await Exam.create({
      title,
      description,
      subject,
      duration,
      instructions,
      startTime, // Can be null if always available
      endTime,
      shuffleQuestions,
      shuffleOptions,
      showResultsImmediately,
      allowReview,
      maxAttempts,
      organizationId: decoded.organizationId,
      createdBy: decoded.userId,
      totalMarks: questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0),
    });

    // 2. Create ExamQuestions
    const examQuestionPromises = questions.map((q: any, index: number) => {
      return ExamQuestion.create({
        examId: exam._id,
        questionId: q.questionId,
        questionOrder: index + 1,
        marks: q.marks || 1,
      });
    });

    await Promise.all(examQuestionPromises);

    return NextResponse.json({ 
      message: 'Exam created successfully', 
      examId: exam._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Exam Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET /api/exams - List exams
export async function GET(req: Request) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');

    const query: any = { organizationId: decoded.organizationId };
    
    // If user is a teacher/examiner, only show their own exams
    if (decoded.role === 'TEACHER' || decoded.role === 'examiner') {
      query.createdBy = decoded.userId;
    }

    if (subject) query.subject = subject;

    const exams = await Exam.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(exams);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
