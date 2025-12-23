import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Student from '@/models/Student';
import '@/models/Class'; // Register Class model for populate
import { verifyToken } from '@/lib/auth'; // Ensure verifyToken is imported

export const dynamic = 'force-dynamic';

// GET /api/students - List all students for organization
export async function GET(req: Request) {
    try {
        await dbConnect();

        const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.organizationId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Find students belonging to this organization
        const students = await Student.find({ organizationId: decoded.organizationId })
            .populate({
                path: 'userId', // naming of the field in Student schema
                select: 'name email role status createdAt' // Fields to select from User
            })
            .populate('classId', 'name level section') // Populate class details
            .sort({ createdAt: -1 });

        // Transform data for frontend
        const formattedStudents = students.map(student => {
            // Handle case where user might be null if deleted (shouldn't happen but safe)
            if (!student.userId) return null;

            return {
                id: student.userId._id, // Usable ID for user operations like Approve
                studentId: student._id, // ID of student profile
                name: student.userId.name,
                email: student.userId.email,
                role: student.userId.role,
                status: student.userId.status,
                registeredAt: student.userId.createdAt, // Or student.createdAt
                className: student.classId ? `${student.classId.level} ${student.classId.section || ''}` : 'Unhomed',
                studentSpecificId: student.studentId
            };
        }).filter(Boolean);

        return NextResponse.json(formattedStudents);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST /api/students - Create a new student account (Org Admin only)
export async function POST(req: Request) {
    try {
        await dbConnect();

        const {
            name,
            email,
            password,
            organizationId,
            phone,
            studentId,
            dateOfBirth,
            guardianName,
            guardianPhone,
            guardianEmail
        } = await req.json();

        if (!name || !email || !password || !organizationId) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create user account with STUDENT role and ACTIVE status
        // When created by school admin, they are active immediately
        const user = await User.create({
            name,
            email,
            password,
            role: 'STUDENT',
            organizationId,
            status: 'ACTIVE',
            phone,
        });

        // Create student profile
        const student = await Student.create({
            userId: user._id,
            organizationId,
            studentId,
            dateOfBirth,
            guardianName,
            guardianPhone,
            guardianEmail
        });

        return NextResponse.json(
            {
                message: 'Student account created successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
                student: {
                    _id: student._id,
                    studentId: student.studentId,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
