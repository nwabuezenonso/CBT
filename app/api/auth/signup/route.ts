import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import UserModel from "../../users/userModel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, emailAddress, organizationName, password } = body;

    // Basic validation
    if (!firstName || !lastName || !emailAddress || !organizationName || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await UserModel.findOne({ emailAddress });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    await UserModel.create({
      firstName,
      lastName,
      emailAddress,
      organizationName,
      password,
      role: "ADMIN",
    });

    return NextResponse.json({ message: "User created successfully." }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
