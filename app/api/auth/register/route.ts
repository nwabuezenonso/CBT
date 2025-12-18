import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Student from '@/models/Student';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { 
      name, 
      email, 
      password, 
      role, 
      organizationId,
      phone,
      dateOfBirth,
      guardianName,
      guardianPhone,
      guardianEmail,
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Validate organization for non-super-admin roles
    if (role !== 'SUPER_ADMIN' && !organizationId) {
      return NextResponse.json(
        { message: 'Organization is required' },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user with PENDING status (will need admin approval)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'STUDENT',
      organizationId: role === 'SUPER_ADMIN' ? null : organizationId,
      status: 'PENDING', // Default to PENDING for new users
      phone,
    });

    // If student, create student profile
    if (user.role === 'STUDENT') {
      await Student.create({
        userId: user._id,
        organizationId,
        dateOfBirth,
        guardianName,
        guardianPhone,
        guardianEmail,
      });
    }

    // Don't generate token for PENDING users
    // They need to wait for approval
    const response = NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        message: 'Registration successful. Please wait for admin approval.',
      },
      { status: 201 }
    );

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
