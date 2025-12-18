import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET /api/users/pending - Get all pending user approvals
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    const query: any = { status: 'PENDING' };
    if (organizationId) {
      query.organizationId = organizationId;
    }

    const pendingUsers = await User.find(query)
      .populate('organizationId', 'name type')
      .sort({ createdAt: -1 })
      .select('-password');

    return NextResponse.json(pendingUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
