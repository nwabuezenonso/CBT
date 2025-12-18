import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Teacher from '@/models/Teacher';

// POST /api/teachers - Create a new teacher account (Org Admin only)
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { 
      name, 
      email, 
      password, 
      organizationId, 
      subjects, 
      employeeId,
      phone,
      createdBy 
    } = await req.json();

    if (!name || !email || !password || !organizationId || !createdBy) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user account with TEACHER role and ACTIVE status
    const user = await User.create({
      name,
      email,
      password,
      role: 'TEACHER',
      organizationId,
      status: 'ACTIVE', // Teachers are auto-approved when created by org admin
      phone,
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user._id,
      organizationId,
      subjects: subjects || [],
      employeeId,
      createdBy,
    });

    return NextResponse.json(
      {
        message: 'Teacher account created successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        teacher: {
          _id: teacher._id,
          subjects: teacher.subjects,
          employeeId: teacher.employeeId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/teachers - List teachers in an organization
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { message: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const teachers = await Teacher.find({ organizationId })
      .populate('userId', 'name email phone status')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(teachers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
