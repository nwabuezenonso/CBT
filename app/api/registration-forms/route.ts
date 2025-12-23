import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';
import '@/models/Organization'; // Register Organization model
import '@/models/Class'; // Register Class model
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/registration-forms - List forms
export async function GET(req: Request) {
    try {
        await dbConnect();

        // Auth Check
        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.organizationId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const organizationId = decoded.organizationId;

        // Optional query filters
        const isActive = searchParams.get('isActive');

        const query: any = { organizationId };
        if (isActive !== null) query.isActive = isActive === 'true';

        // If examiner, maybe only show their forms? 
        // Requirement says "Examiner dashboard", implying they manage their own or org's forms.
        // Let's allow seeing all org forms for now, or filter by createdBy if strict.
        // For now, allow seeing all forms in organization.

        const forms = await RegistrationForm.find(query)
            .populate('createdBy', 'name')
            .populate('targetClassId', 'name level section')
            .sort({ createdAt: -1 });

        return NextResponse.json(forms);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST /api/registration-forms - Create form
export async function POST(req: Request) {
    try {
        await dbConnect();

        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.organizationId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            targetClassId,
            targetSubject,
            accessDurationDays,
            fields
        } = body;

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const form = await RegistrationForm.create({
            title,
            organizationId: decoded.organizationId,
            createdBy: decoded.userId,
            targetClassId: targetClassId || undefined,
            targetSubject,
            accessDurationDays,
            fields: fields || [],
            isActive: true
        });

        return NextResponse.json(form, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
