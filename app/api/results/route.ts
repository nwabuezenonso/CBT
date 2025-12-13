import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Exam from '@/models/Exam';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Auth Check
    // 1. Auth Check (Optional)
    let decoded: any = null;
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (token) {
        decoded = verifyToken(token);
    }
    // If no token, we proceed as anonymous


    // 2. Parse Body
    const body = await req.json();
    const { examId, answers, timeSpent } = body;

    if (!examId || !answers) {
        return NextResponse.json({ message: 'Missing examId or answers' }, { status: 400 });
    }

    // 3. Fetch Exam to calculate score
    // We need correct answers, so we might need to select them if they are hidden.
    // In Exam.ts, 'correctAnswer' has select: false.
    const exam = await Exam.findById(examId).select('+questions.correctAnswer');

    if (!exam) {
        return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    // 4. Calculate Score
    let score = 0;
    let totalPoints = 0;
    const processedAnswers = [];

    for (const question of exam.questions) {
        totalPoints += question.points || 1;
        const userAnswer = answers[question._id.toString()] || answers[question.id]; // Handle both just in case
        
        let isCorrect = false;

        // Simple comparison logic
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
             // Ensure string comparison
             if (String(userAnswer) === String(question.correctAnswer)) {
                 isCorrect = true;
                 score += question.points || 1;
             }
        } 
        // TODO: Short answer fuzzy match? Keeping it exact for now.

        if (userAnswer !== undefined) {
             processedAnswers.push({
                 questionId: question._id,
                 answer: userAnswer,
                 isCorrect
             });
        }
    }
    
    // 5. Save Result
    const result = await Result.create({
        examId,
        examineeId: decoded ? (decoded.id || decoded._id) : undefined,
        score,
        totalQuestions: exam.questions.length,
        answers: processedAnswers,
        submittedAt: new Date(),
    });

    return NextResponse.json({ 
        message: 'Exam submitted successfully', 
        resultId: result._id,
        score,
        totalPoints,
        percentage: Math.round((score / totalPoints) * 100)
    }, { status: 201 });

  } catch (error: any) {
    console.error('Submit Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        
        // Return results for the logged in user
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json([], { status: 401 });
        
        const decoded: any = verifyToken(token);
        // If examiner, maybe fetch all results for their exams?
        // If examinee, fetch their own results.
        
        if (decoded.role === 'examiner') {
             // Find exams by this examiner, then results for those exams?
             // Or simple approach: return all results if specific query.
             // For now, let's just return nothing or implement as needed.
             // Maybe fetch all results for exams created by this examiner.
             const exams = await Exam.find({ examinerId: decoded.id }).select('_id');
             const examIds = exams.map(e => e._id);
             const results = await Result.find({ examId: { $in: examIds } })
                .populate('examineeId', 'name email')
                .populate('examId', 'title')
                .sort({ submittedAt: -1 });
             return NextResponse.json(results);
        } else {
             const results = await Result.find({ examineeId: decoded.id })
                .populate('examId', 'title')
                .sort({ submittedAt: -1 });
             return NextResponse.json(results);
        }

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
