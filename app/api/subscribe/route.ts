// app/api/emails/route.ts
import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";

import dbConnect from "@/lib/mongodb";
import WaitlistModel from "@/models/waitlist";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await WaitlistModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const newEmail = await WaitlistModel.create({ email });
    return NextResponse.json({ message: "Email saved ✅", data: newEmail }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
