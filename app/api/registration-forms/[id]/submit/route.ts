import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegistrationForm from '@/models/RegistrationForm';
import User from '@/models/User';
import Student from '@/models/Student';

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();

        const {
            name,
            email,
            password,
            phone,
            guidanceName,
            guidancePhone,
            dateOfBirth,
            customData
        } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
        }

        // 1. Validate Form
        const form = await RegistrationForm.findById(params.id);
        if (!form || !form.isActive) {
            return NextResponse.json({ message: 'Form is invalid or inactive' }, { status: 400 });
        }

        // 2. Check User Existence
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // 3. Create User
        // Default to ACTIVE since they are registering via a trusted link with predefined access
        const user = await User.create({
            name,
            email,
            password,
            role: 'STUDENT',
            organizationId: form.organizationId,
            status: 'ACTIVE',
            phone,
        });

        // 4. Calculate Expiry
        let accessExpiresAt = null;
        if (form.accessDurationDays) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + form.accessDurationDays);
            accessExpiresAt = expiryDate;
        }

        // 5. Create Student Profile
        await Student.create({
            userId: user._id,
            organizationId: form.organizationId,
            classId: form.targetClassId || undefined,
            accessExpiresAt,
            customData: customData || {},
            guardianName: guidanceName,  // Mapping from standard fields if provided
            guardianPhone: guidancePhone,
            dateOfBirth: dateOfBirth,
        });

        return NextResponse.json({
            message: 'Registration successful',
            userId: user._id
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
