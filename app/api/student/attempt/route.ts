import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamAssignment from '@/models/ExamAssignment';
import ExamAttempt from '@/models/ExamAttempt';
import ExamQuestion from '@/models/ExamQuestion';
import Question from '@/models/question'; // import model to populate if needed, though ExamQuestion has the link
import AnswerOption from '@/models/AnswerOption';
import { verifyToken } from '@/lib/auth';


// POST /api/student/attempt - Start an exam attempt
export async function POST(req: Request) {
  try {
    await dbConnect();
    // Auth Check - Use headers set by middleware
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { assignmentId } = await req.json();

    // 1. Verify Assignment validity
    const assignment = await ExamAssignment.findById(assignmentId).populate('examId');
    if (!assignment) return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });

    // Check time window
    const now = new Date();
    if (now < new Date(assignment.startTime)) {
        return NextResponse.json({ message: 'Exam has not started yet' }, { status: 403 });
    }
    if (now > new Date(assignment.endTime)) {
        return NextResponse.json({ message: 'Exam has ended' }, { status: 403 });
    }

    // Check existing attempt
    let attempt = await ExamAttempt.findOne({ 
        examAssignmentId: assignmentId, 
        studentId: userId 
    });

    if (attempt) {
        if (attempt.status === 'SUBMITTED' || attempt.status === 'COMPLETED') {
             // Check max attempts
             const exam = assignment.examId;
             const attemptCount = await ExamAttempt.countDocuments({ examAssignmentId: assignmentId, studentId: userId });
             if (attemptCount >= (exam.maxAttempts || 1)) {
                 return NextResponse.json({ message: 'Max attempts reached' }, { status: 403 });
             }
             // Else create new attempt? 
             // For simplicity, let's assume 1 attempt for now unless we loop specific logic.
             return NextResponse.json({ message: 'You have already submitted this exam' }, { status: 403 });
        }
        // If status is STARTED, return existing attempt to resume
        return NextResponse.json({ attemptId: attempt._id, status: 'RESUMED' });
    }

    // 2. Create New Attempt
    // Generate Seeds for Shuffling
    const questionSeed = Math.random(); // We store this to reproduce the shuffle order
    // Option seeds can be per question, but ExamAttempt model has `optionSeeds` map if we want per-question
    // Or we use a global seed? The model says `optionSeeds: Map<String, Number>`.

    // Fetch Exam Questions to initialize option seeds
    const examQuestions = await ExamQuestion.find({ examId: assignment.examId._id });
    const optionSeeds = {};
    examQuestions.forEach(eq => {
        // @ts-ignore
        optionSeeds[eq.questionId.toString()] = Math.random();
    });

    attempt = await ExamAttempt.create({
        examAssignmentId: assignmentId,
        studentId: userId,
        startTime: now,
        status: 'STARTED',
        questionSeed,
        optionSeeds
    });

    return NextResponse.json({ attemptId: attempt._id, status: 'CREATED' }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET /api/student/attempt/[id] - Get exam data for taking (questions, etc.)
// This endpoint returns the questions in the shuffled order determined by the seed
export async function GET(req: Request) {
    // This logic might be complex enough to deserve its own file [id]/route.ts
    // But let's check if the router handles it inside [id] folder.
    return NextResponse.json({ message: 'Use dynamic route' }, { status: 404 });
}
