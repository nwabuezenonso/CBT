import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/classes - List classes for an organization
export async function GET(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    // Ensure user accesses their own organization's data
    if (organizationId && organizationId !== decoded.organizationId && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access to organization data' }, { status: 403 });
    }

    const query: any = { organizationId: decoded.organizationId };

    // If user is a examiner, only show their own classes
    if (decoded.role === 'EXAMINER' || decoded.role === 'examiner') {
      query.createdBy = decoded.userId;
    }

    const classes = await Class.find(query)
      .populate('createdBy', 'name email')
      .sort({ level: 1, section: 1 });

    return NextResponse.json(classes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create a new class
export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || !decoded.organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, level, section, academicYear } = await req.json();

    if (!name || !level || !academicYear) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const classObj = await Class.create({
      organizationId: decoded.organizationId,
      name,
      level,
      section,
      academicYear,
      createdBy: decoded.userId,
    });

    return NextResponse.json(classObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
