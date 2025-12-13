import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Check if already assigned
    const existing = await Assignment.findOne({ 
        studentId: body.studentId, 
        examId: body.examId 
    });

    if (existing) {
        return NextResponse.json({ message: "Exam already assigned to this student" }, { status: 400 });
    }

    const assignment = await Assignment.create(body);

    // Send invitation email
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const examLink = `${appUrl}/exam/${body.examId}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>You have been invited to take an exam!</h2>
                <p>Hello ${body.studentName},</p>
                <p>You have been assigned to the exam: <strong>${body.examTitle}</strong>.</p>
                <p>Please click the button below to start your exam:</p>
                <a href="${examLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Take Exam</a>
                <p style="margin-top: 20px;">Or copy and paste this link: ${examLink}</p>
                <p>Good luck!</p>
            </div>
        `;

        // We use a dynamic import or require to avoid circular deps if any, 
        // but here it is fine to import from lib
        // Using require here just to be safe with tool execution order or import top level
        const { sendEmail } = require('@/lib/email');
        await sendEmail({
            to: body.studentEmail,
            subject: `Exam Invitation: ${body.examTitle}`,
            html: emailHtml,
        });

    } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // We don't fail the request if email fails, but we log it.
    }

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Assignment Create Error:", error);
    return NextResponse.json({ message: "Error assigning exam" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');
        
        let query = {};
        if (studentId) {
            query = { studentId };
        }

        const assignments = await Assignment.find(query).sort({ assignedAt: -1 });
        return NextResponse.json(assignments);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching assignments" }, { status: 500 });
    }
}
