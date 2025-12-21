import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

// POST /api/classes/:id/students - Assign students to a class
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const { studentIds } = await req.json();

    if (!studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json(
        { message: 'Student IDs array is required' },
        { status: 400 }
      );
    }

    // Update all students to assign them to this class
    const result = await Student.updateMany(
      { userId: { $in: studentIds } },
      { classId: id }
    );

    return NextResponse.json(
      {
        message: `${result.modifiedCount} students assigned to class`,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/classes/:id/students - Get students in a class
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const students = await Student.find({ classId: id })
      .populate('userId', 'name email phone status')
      .populate('organizationId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
