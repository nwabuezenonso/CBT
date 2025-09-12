import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExamModel from "./examsModel";

export async function GET() {
  await dbConnect();

  try {
    const exams = await ExamModel.find();
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const exam = await ExamModel.create(body);
    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create exam" }, { status: 400 });
  }
}
