import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Organization from '@/models/Organization';

// GET /api/organizations - List all organizations (Super Admin only)
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const organizations = await Organization.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(organizations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create new organization (Super Admin only)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, type, email, phone, address } = await req.json();

    if (!name || !type || !email) {
      return NextResponse.json(
        { message: 'Please provide name, type, and email' },
        { status: 400 }
      );
    }

    // Check if organization with email already exists
    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return NextResponse.json(
        { message: 'Organization with this email already exists' },
        { status: 400 }
      );
    }

    const organization = await Organization.create({
      name,
      type,
      email,
      phone,
      address,
      status: 'ACTIVE',
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
