import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/question';
import AnswerOption from '@/models/AnswerOption';
import { verifyToken, JWTPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/questions - List questions for an organization
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Auth check
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized or invalid organization' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    const query: any = { organizationId: decoded.organizationId };

    // If user is a teacher/examiner, only show their own questions
    if (decoded.role === 'TEACHER' || decoded.role === 'examiner') {
      query.createdBy = decoded.userId;
    }
    
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(questions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/questions - Create a new question with options
export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      questionText,
      type = 'multiple-choice',
      subject,
      topic,
      difficulty,
      points = 1,
      explanation,
      options // Expecting array of { optionText, isCorrect, explanation? }
    } = body;

    if (!questionText || !subject || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { message: 'Please provide question text, subject, and at least 2 options.' },
        { status: 400 }
      );
    }

    // 1. Create Question
    const question = await Question.create({
      questionText,
      type,
      subject,
      topic,
      difficulty,
      points,
      explanation,
      organizationId: decoded.organizationId,
      createdBy: decoded.userId,
    });

    // 2. Create AnswerOptions
    const optionPromises = options.map((opt: any, index: number) => {
      return AnswerOption.create({
        questionId: question._id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect || false,
        displayOrder: index,
      });
    });

    await Promise.all(optionPromises);

    return NextResponse.json({ 
      message: 'Question created successfully', 
      questionId: question._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
