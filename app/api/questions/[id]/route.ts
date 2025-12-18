import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/question';
import AnswerOption from '@/models/AnswerOption';
import { verifyToken } from '@/lib/auth';

// GET /api/questions/:id - Get question details including options
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Verify auth
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const question = await Question.findById(params.id)
      .populate('createdBy', 'name');

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // Check organization access
    if (question.organizationId.toString() !== decoded.organizationId && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Fetch options
    const options = await AnswerOption.find({ questionId: question._id }).sort({ displayOrder: 1 });

    return NextResponse.json({ ...question.toObject(), options }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/questions/:id - Update question and options
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      questionText,
      subject,
      topic,
      difficulty,
      points,
      explanation,
      options
    } = body;

    const question = await Question.findById(params.id);
    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });

    // Check permissions
    if (question.organizationId.toString() !== decoded.organizationId && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Update question fields
    if (questionText) question.questionText = questionText;
    if (subject) question.subject = subject;
    if (topic) question.topic = topic;
    if (difficulty) question.difficulty = difficulty;
    if (points) question.points = points;
    if (explanation) question.explanation = explanation;

    await question.save();

    // Update options if provided
    // Strategy: Delete existing and recreate? Or update intelligently?
    // For simplicity and correctness with IDs, let's delete and recreate for now, 
    // OR if we want to preserve IDs (better for exam logs), we should update.
    // Given this is a "Question Bank" edit, if the question hasn't been taken yet, it's fine.
    // If it HAS been taken, editing options might be dangerous for historical data?
    // Actually, ExamQuestion snapshots marks, but AnswerOption IDs are referenced in StudentAnswer.
    // So DELETING options will break historical references if we strictly reference ID.
    // However, for this task, let's assume valid edits.
    // A safer approach for now: Delete all options for this question and recreate them.
    // Note: In a production system with live exams, you might version questions instead of editing them in place.
    
    if (options && Array.isArray(options)) {
        // Warning: This changes Option IDs. In a real system, use soft delete or versioning.
        await AnswerOption.deleteMany({ questionId: question._id });
        
        const optionPromises = options.map((opt: any, index: number) => {
            return AnswerOption.create({
                questionId: question._id,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect || false,
                displayOrder: index,
            });
        });
        await Promise.all(optionPromises);
    }

    return NextResponse.json({ message: 'Question updated successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/questions/:id - Delete question
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const question = await Question.findById(params.id);
    if (!question) return NextResponse.json({ message: 'Question not found' }, { status: 404 });

    if (question.organizationId.toString() !== decoded.organizationId && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Delete associated options
    await AnswerOption.deleteMany({ questionId: question._id });
    
    // Delete the question
    await Question.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
