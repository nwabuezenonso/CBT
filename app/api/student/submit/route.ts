import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamAttempt from '@/models/ExamAttempt';
import StudentAnswer from '@/models/StudentAnswer';
import ExamQuestion from '@/models/ExamQuestion';
import AnswerOption from '@/models/AnswerOption';
import { verifyToken } from '@/lib/auth';

// POST /api/student/submit - Submit exam answers
export async function POST(req: Request) {
  try {
    await dbConnect();
    // Auth Check - Use headers set by middleware
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { attemptId, answers } = body; 
    // answers: Record<questionId, optionId> (for MC)

    const attempt = await ExamAttempt.findById(attemptId).populate({
        path: 'examAssignmentId',
        populate: { path: 'examId' }
    });
    
    if (!attempt) return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    if (attempt.status === 'SUBMITTED') return NextResponse.json({ message: 'Already submitted' }, { status: 400 });

    // Calculate Score
    let totalScore = 0;
    let totalPossible = 0;

    const examId = attempt.examAssignmentId.examId._id;
    const examQuestions = await ExamQuestion.find({ examId });
    
    // Process answers
    // Optimization: Bulk define
    const studentAnswerDocs = [];

    for (const eq of examQuestions) {
        const qId = eq.questionId.toString();
        const selectedOptionId = answers[qId];
        const marksParams = eq.marks || 1;
        totalPossible += marksParams;

        let isCorrect = false;
        let score = 0;

        if (selectedOptionId) {
            // Verify correctness
            const option = await AnswerOption.findById(selectedOptionId);
            if (option && option.isCorrect && option.questionId.toString() === qId) {
                isCorrect = true;
                score = marksParams;
            }
        }
        
        totalScore += score;

        studentAnswerDocs.push({
            attemptId: attempt._id,
            questionId: qId,
            selectedOptionId: selectedOptionId || null,
            isCorrect,
            marksAwarded: score
        });
    }

    // Save all answers
    await StudentAnswer.insertMany(studentAnswerDocs);

    // Update Attempt
    attempt.status = 'SUBMITTED';
    attempt.endTime = new Date();
    attempt.score = totalScore;
    attempt.totalMarks = totalPossible;
    await attempt.save();

    return NextResponse.json({ 
        message: 'Exam submitted successfully', 
        score: totalScore, 
        total: totalPossible 
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
