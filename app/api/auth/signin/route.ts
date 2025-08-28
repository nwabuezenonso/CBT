import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserModel from "../../users/userModel";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailAddress, password } = body;

    // Basic validation
    if (!emailAddress || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ emailAddress });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // ✅ Success
    return NextResponse.json({ message: "User logged in successfully" }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
