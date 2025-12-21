import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// PATCH /api/users/:id/reject - Reject a pending user
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { rejectedBy, reason } = await req.json();

    if (!rejectedBy) {
      return NextResponse.json(
        { message: 'Rejector ID is required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'User is not pending approval' },
        { status: 400 }
      );
    }

    user.status = 'REJECTED';
    user.approvedBy = rejectedBy; // Store who rejected
    user.approvedAt = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: 'User rejected successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
