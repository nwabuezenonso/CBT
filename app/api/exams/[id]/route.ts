import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExamModel from "../examsModel";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const data = await req.json();
    const updated = await ExamModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  try {
    const deleted = await ExamModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 400 });
  }
}
