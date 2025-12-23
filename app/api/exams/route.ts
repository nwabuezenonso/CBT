import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';
import ExamQuestion from '@/models/ExamQuestion';
import '@/models/Class'; // Register Class model
import '@/models/User'; // Register User model for populate
import '@/models/Organization'; // Register Organization model
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/exams - Create new exam
export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      console.error('POST /api/exams: Missing token');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      console.error('POST /api/exams: Invalid token or missing organizationId', decoded);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('POST /api/exams: Received Payload:', JSON.stringify(body, null, 2));
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
      questions, // Array of { questionId, marks }
      assignedClasses,
      assignedSubjects
    } = body;

    console.log('Creating Exam Payload Questions:', JSON.stringify(questions, null, 2));

    // Validation: Require basic details. Questions can be empty if it's a draft, but let's enforce at least 1 for now as per previous logic.
    if (!title || !duration) { // Subject is now optional if using assignedSubjects
      return NextResponse.json(
        { message: 'Please provide title and duration.' },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { message: 'Please add at least one question to the exam.' },
        { status: 400 }
      );
    }

    // 1. Create Exam
    const exam = await Exam.create({
      title,
      description,
      subject, // Primary subject, optional
      assignedClasses: assignedClasses || [],
      assignedSubjects: assignedSubjects || [],
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
      totalMarks: questions.reduce((sum: number, q: any) => sum + (Number(q.marks) || 1), 0),
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
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
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

    // If user is a examiner, only show their own exams
    if (decoded.role === 'EXAMINER' || decoded.role === 'examiner') {
      query.createdBy = decoded.userId;
    }

    // If user is a student, filter by their class
    if (decoded.role === 'STUDENT' || decoded.role === 'student') {
      // We need to fetch the student's classId
      // Assuming Student model is linked to User via userId
      const { default: Student } = await import('@/models/Student');
      const student = await Student.findOne({ userId: decoded.userId });

      if (student) {
        const conditions: any[] = [];

        // 1. Matches Class
        if (student.classId) {
          conditions.push({ assignedClasses: student.classId });
        }

        // 2. Matches Subject (if student has registered subjects, currently not in model, but maybe check if url param subject matches assignedSubjects)
        // For now, let's allow if assignedSubjects matches the requested subject (from query param)
        // or if the exam has assignedSubjects and it overlaps with student's subjects? 
        // The user said "assign exam based on class e.g jss2 or based on science or art class" 
        // "Science or Art class" might imply the class name or a subject bucket.
        // Let's stick to Class ID match OR if assignedClasses is empty (global) - wait, user wants assignment. 
        // Safest: If assignedClasses is NOT empty, must match. If empty, visible? 
        // Let's implement OR logic: Visible if (Assigned to Class) OR (Assigned to Subject) OR (No Assignments [Global])

        // BUT, if I put restrictions, I should probably enforce them. 
        // Logic: 
        // Show if (assignedClasses includes myClass) 
        // OR (assignedSubjects matches 'subject' param if provided?? No, that's filtering)
        // OR (assignedClasses is empty AND assignedSubjects is empty)

        query.$or = [
          { assignedClasses: student.classId },
          { assignedClasses: { $exists: false } },
          { assignedClasses: { $size: 0 } }
        ];

        // If assignedSubjects is used, we might need student subjects. 
        // For now, let's trust the Class assignment is the primary request.
      }
    }

    if (subject) query.subject = subject;

    console.log('GET /api/exams: Querying with', JSON.stringify(query));

    const exams = await Exam.find(query)
      .populate('createdBy', 'name')
      .populate({ path: 'assignedClasses', select: 'name level section', strictPopulate: false })
      .sort({ createdAt: -1 });

    console.log(`GET /api/exams: Found ${exams.length} exams`);

    return NextResponse.json(exams);
  } catch (error: any) {
    console.error('GET /api/exams Error:', error);
    // Log stack trace if available
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
  }
}
