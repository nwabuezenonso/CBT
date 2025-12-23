import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';

import ExamQuestion from '@/models/ExamQuestion';
import '@/models/question'; // Register Question model
import { verifyToken } from '@/lib/auth'; // To check role

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const exam = await Exam.findById(id).populate('assignedClasses'); // Populate classes too if needed

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    // Fetch questions
    let examQuestions = await ExamQuestion.find({ examId: id })
      .populate('questionId')
      .sort({ questionOrder: 1 });

    // Transform to expected format
    let questions = examQuestions.map(eq => {
      const q = eq.questionId;
      if (!q) return null;
      return {
        ...q.toObject(),
        _id: q._id,
        marks: eq.marks, // Use marks from ExamQuestion
        questionId: q._id // Ensure ID availability
      };
    }).filter(Boolean);

    // Apply Shuffling if user is a STUDENT (or if explicitly requested via logic, but doing it here for security)
    // Check token
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.role === 'STUDENT') {
        if (exam.shuffleQuestions) {
          // Fisher-Yates shuffle
          for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
          }
        }
        // Shuffle Options if enabled
        if (exam.shuffleOptions) {
          questions = questions.map((q: any) => {
            if (q.options && Array.isArray(q.options)) {
              const shuffledOptions = [...q.options];
              // Shuffle options
              for (let i = shuffledOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
              }
              return { ...q, options: shuffledOptions };
            }
            return q;
          });
        }
      }
    }

    // Attach questions to exam object
    const examObj = exam.toObject();
    examObj.questions = questions;

    return NextResponse.json(examObj);
  } catch (error: any) {
    console.error("GET Exam Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    // Sync status with isActive if provided
    if (typeof updates.isActive !== 'undefined') {
      updates.status = updates.isActive ? 'published' : 'draft';
    }

    const exam = await Exam.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
