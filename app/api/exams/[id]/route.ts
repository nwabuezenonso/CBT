import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exam from '@/models/Exam';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // params needs to be awaited in newer Next.js versions if it's a promise, 
    // but typically in standard app dir it's an object or promise depending on version. 
    // To be safe in current Next 15 world or late 14:
    // const { id } = await params; 
    // However, the signature above is standard for 14. 
    // Let's assume standard object for now or await it if it complains.
    const id = params.id;

    const exam = await Exam.findById(id);

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = params.id;
    const updates = await req.json();

    // Sync status with isActive if provided
    if (typeof updates.isActive !== 'undefined') {
        updates.status = updates.isActive ? 'published' : 'draft';
    }

    const exam = await Exam.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = params.id;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
