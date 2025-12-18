import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// PATCH /api/users/:id/approve - Approve a pending user
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { approvedBy } = await req.json();

    if (!approvedBy) {
      return NextResponse.json(
        { message: 'Approver ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(params.id);

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

    user.status = 'ACTIVE';
    user.approvedBy = approvedBy;
    user.approvedAt = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: 'User approved successfully',
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
