import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await dbConnect();

    // Auth Check - Use headers set by middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    const userOrgId = req.headers.get('x-user-org');

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const orgId = params.id;

    // Only allow org admins to view their own org stats, or super admins
    if (userRole !== 'SUPER_ADMIN' && userOrgId !== orgId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const [examinerCount, studentCount] = await Promise.all([
      User.countDocuments({ organizationId: params.id, role: 'EXAMINER', status: { $ne: 'REJECTED' } }),
      User.countDocuments({ organizationId: params.id, role: 'STUDENT', status: { $ne: 'REJECTED' } })
    ]);

    return NextResponse.json({
      examiners: examinerCount,
      students: studentCount
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
