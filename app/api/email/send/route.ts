import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const info = await sendEmail({ to, subject, html });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ 
        message: "Email sent successfully", 
    });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
