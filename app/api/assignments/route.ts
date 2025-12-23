import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamAssignment from '@/models/ExamAssignment';
import Class from '@/models/Class';
import '@/models/Exam'; // Register Exam model for populate
import { verifyToken } from '@/lib/auth';

// POST /api/assignments - Assign exam to class
export async function POST(req: Request) {
  try {
    await dbConnect();

    // Auth Check
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { examId, classId, startTime, endTime } = body;

    if (!examId || !classId || !startTime || !endTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Verify Class ownership/organization
    const classData = await Class.findOne({ _id: classId, organizationId: decoded.organizationId });
    if (!classData) {
      return NextResponse.json({ message: 'Invalid Class' }, { status: 400 });
    }

    const assignment = await ExamAssignment.create({
      examId,
      classId,
      assignedBy: decoded.userId,
      startTime,
      endTime,
      status: 'SCHEDULED'
    });

    assignment.updateStatus();
    await assignment.save();

    return NextResponse.json({
      message: 'Exam assigned successfully',
      assignmentId: assignment._id
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET /api/assignments - List assignments
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
    const examId = searchParams.get('examId');
    const classId = searchParams.get('classId');

    const orgClasses = await Class.find({ organizationId: decoded.organizationId }).select('_id');
    const orgClassIds = orgClasses.map(c => c._id);

    const query: any = { classId: { $in: orgClassIds } };

    if (examId) query.examId = examId;
    if (classId) {
      if (!orgClassIds.some(id => id.toString() === classId)) {
        return NextResponse.json([]);
      }
      query.classId = classId;
    }

    const assignments = await ExamAssignment.find(query)
      .populate('examId', 'title duration subject')
      .populate('classId', 'name level section')
      .sort({ startTime: -1 });

    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
