import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    // Try finding by form ID first, then by exam ID (as service uses examId lookup)
    let form = await RegistrationForm.findById(id);
    if (!form) {
       form = await RegistrationForm.findOne({ examId: id });
    }

    if (!form) {
      return NextResponse.json({ message: "Registration form not found" }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching form" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    // Determine if we are updating by ID or finding by ID
    const form = await RegistrationForm.findByIdAndUpdate(id, body, { new: true });
    
    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json({ message: "Error updating form" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await RegistrationForm.findByIdAndDelete(id);
    return NextResponse.json({ message: "Form deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting form" }, { status: 500 });
  }
}
