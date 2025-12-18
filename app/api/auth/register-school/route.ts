import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Organization from '@/models/Organization';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { 
      name, // Admin Name
      email, // Admin Email
      password, 
      organizationName,
      organizationType,
      organizationEmail,
      organizationPhone,
      organizationAddress
    } = await req.json();

    if (!name || !email || !password || !organizationName || !organizationType || !organizationEmail) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // 1. Check if user or org email already exists
    const userExists = await User.findOne({ email });
    const orgExists = await Organization.findOne({ email: organizationEmail });

    if (userExists) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    if (orgExists) {
      return NextResponse.json(
        { message: 'Organization with this email already exists' },
        { status: 400 }
      );
    }

    // 2. Create Organization
    const organization = await Organization.create({
      name: organizationName,
      type: organizationType,
      email: organizationEmail,
      phone: organizationPhone,
      address: organizationAddress,
      status: 'ACTIVE'
    });

    try {
      // 3. Create Admin User
      const user = await User.create({
        name,
        email,
        password,
        role: 'ORG_ADMIN',
        organizationId: organization._id,
        status: 'ACTIVE',
        phone: organizationPhone
      });

      // Return success
      return NextResponse.json(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: organization._id,
          message: 'School registration successful',
        },
        { status: 201 }
      );
    } catch (userError) {
      // If user creation fails, we should ideally delete the organization or handle cleanup
      // For now, simpler error handling
      console.error('Error creating user after organization:', userError);
      
      // Attempt cleanup (best effort)
      await Organization.findByIdAndDelete(organization._id);
      
      throw userError;
    }

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
