import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';
import '@/models/Organization'; // Register Organization model
import '@/models/Class'; // Register Class model
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/registration-forms/[id] - Get form details (Public)
export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();

        // This is public, no auth check needed to view the form
        const form = await RegistrationForm.findById(params.id)
            .populate('targetClassId', 'name level section')
            .populate('organizationId', 'name');

        if (!form) {
            return NextResponse.json({ message: 'Form not found' }, { status: 404 });
        }

        if (!form.isActive) {
            return NextResponse.json({ message: 'This form is no longer active' }, { status: 410 });
        }

        // Return necessary public info
        return NextResponse.json(form);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE /api/registration-forms/[id] - Delete/Deactivate form
export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();

        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.organizationId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const form = await RegistrationForm.findById(params.id);
        if (!form) {
            return NextResponse.json({ message: 'Form not found' }, { status: 404 });
        }

        // Ensure user owns the form or is admin of the org
        // Strict check: must match organizationId
        if (form.organizationId.toString() !== decoded.organizationId) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await RegistrationForm.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Form deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
