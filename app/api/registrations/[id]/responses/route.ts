import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';


export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // params.id is the FORM ID
    const form = await RegistrationForm.findById(params.id);
    if (!form) {
      return NextResponse.json({ message: "Registration form not found" }, { status: 404 });
    }

    const newResponse = {
      id: crypto.randomUUID(),
      studentName: body.studentName,
      studentEmail: body.studentEmail,
      responses: body.responses,
      submittedAt: new Date(),
      status: 'pending'
    };

    form.responses.push(newResponse);
    await form.save();

    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json({ message: "Error submitting response" }, { status: 500 });
  }
}
