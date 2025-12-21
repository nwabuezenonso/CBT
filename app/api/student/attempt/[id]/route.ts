import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamAssignment from '@/models/ExamAssignment';
import ExamAttempt from '@/models/ExamAttempt';
import ExamQuestion from '@/models/ExamQuestion';
import Question from '@/models/question';
import AnswerOption from '@/models/AnswerOption';
import { verifyToken } from '@/lib/auth';
import { shuffleArray } from '@/lib/shuffle';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    // Auth Check - Use headers set by middleware
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const attemptId = id;
    const attempt = await ExamAttempt.findById(attemptId).populate({
        path: 'examAssignmentId',
        populate: { path: 'examId' }
    });

    if (!attempt) return NextResponse.json({ message: 'Attempt not found' }, { status: 404 });
    if (attempt.studentId.toString() !== userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

    if (attempt.status === 'SUBMITTED' || attempt.status === 'COMPLETED') {
         // Return results if allowed
         const exam = attempt.examAssignmentId.examId;
         if (exam.showResultsImmediately) {
             // Return score
             return NextResponse.json({ 
                 status: attempt.status,
                 score: attempt.score,
                 totalMarks: attempt.totalMarks,
                 completed: true 
             });
         }
         return NextResponse.json({ message: 'Exam submitted', completed: true });
    }

    // FETCH QUESTIONS
    const examId = attempt.examAssignmentId.examId._id;
    
    // Get ExamQuestions with populate
    // Use the `questionOrder` from ExamQuestion as the base order.
    let examQuestions = await ExamQuestion.find({ examId })
        .populate('questionId')
        .sort({ questionOrder: 1 });

    // Apply Shuffling if enabled
    const exam = attempt.examAssignmentId.examId;
    if (exam.shuffleQuestions && attempt.questionSeed) {
        // Use the seed to shuffle the list deterministically
        examQuestions = shuffleArray(examQuestions, attempt.questionSeed);
    }

    // Fetch Options for all questions
    // And shuffle them if enabled
    const questionIds = examQuestions.map(eq => eq.questionId._id);
    const allOptions = await AnswerOption.find({ questionId: { $in: questionIds } });

    // Construct response
    const questionsData = examQuestions.map(eq => {
        const q = eq.questionId;
        // Filter options for this question
        let options = allOptions.filter(o => o.questionId.toString() === q._id.toString());
        
        // Shuffle options?
        if (exam.shuffleOptions) {
             // check seed for this question
             const qSeed = attempt.optionSeeds.get(q._id.toString()) || 0;
             options = shuffleArray(options, qSeed);
        } else {
             options.sort((a, b) => a.displayOrder - b.displayOrder);
        }

        return {
            _id: q._id,
            questionText: q.questionText,
            type: q.type,
            marks: eq.marks,
            options: options.map(o => ({
                _id: o._id,
                optionText: o.optionText
                // DO NOT SEND isCorrect
            }))
        };
    });

    return NextResponse.json({
        attemptId: attempt._id,
        examTitle: exam.title,
        duration: exam.duration,
        startTime: attempt.startTime,
        questions: questionsData
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
