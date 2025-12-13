import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const forms = await RegistrationForm.find().sort({ createdAt: -1 });
    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching registration forms:", error);
    return NextResponse.json({ message: "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Check if form for this exam already exists
    const existing = await RegistrationForm.findOne({ examId: body.examId });
    if (existing) {
       return NextResponse.json({ message: "Registration form for this exam already exists" }, { status: 400 });
    }

    const form = await RegistrationForm.create(body);
    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("Error creating registration form:", error);
    return NextResponse.json({ message: "Failed to create form" }, { status: 500 });
  }
}
