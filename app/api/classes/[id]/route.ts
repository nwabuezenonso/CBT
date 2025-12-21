import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import Student from '@/models/Student';

// GET /api/classes/:id - Get class details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const classObj = await Class.findById(id)
      .populate('organizationId', 'name type')
      .populate('createdBy', 'name email');

    if (!classObj) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(classObj, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/classes/:id - Update class
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    const classObj = await Class.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!classObj) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(classObj, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/:id - Delete class
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Check if class has students
    const studentsCount = await Student.countDocuments({ classId: id });
    
    if (studentsCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete class with assigned students' },
        { status: 400 }
      );
    }

    const classObj = await Class.findByIdAndDelete(id);

    if (!classObj) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Class deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
