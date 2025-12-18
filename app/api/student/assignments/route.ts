import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExamAssignment from '@/models/ExamAssignment';
import Student from '@/models/Student';
import ExamAttempt from '@/models/ExamAttempt';

// GET /api/student/assignments - List available exams for the student
export async function GET(req: Request) {
  console.log('[API] /api/student/assignments - Request received');
  try {
    await dbConnect();
    
    // Auth Check - Use headers set by middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    
    if (!userId || userRole !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized or not a student' }, { status: 403 });
    }

    // 1. Get Student Profile to find Class
    const studentProfile = await Student.findOne({ userId });
    if (!studentProfile || !studentProfile.classId) {
      return NextResponse.json({ message: 'Student class not assigned' }, { status: 404 });
    }

    // 2. Find Assignments for this class
    const now = new Date();
    // Logic: 
    // - Status is ACTIVE 
    // - OR Status is SCHEDULED but time is now (handled by updateStatus usually, but query can cover it)
    // - Actually, we want to show upcoming too? 
    // User wants "Take Exam" for active ones.
    
    // Let's get all assignments for the class
    const assignments = await ExamAssignment.find({ 
        classId: studentProfile.classId,
        // Optional: Filter by time/status to show only relevant ones?
        // Let's filter in UI or return all for now.
    })
    .populate('examId', 'title subject duration instructions')
    .sort({ startTime: 1 });

    // 3. Attach attempt status for each assignment
    // (Did they already take it? In progress?)
    const assignmentsWithStatus = await Promise.all(assignments.map(async (assignment) => {
        const attempt = await ExamAttempt.findOne({ 
            examAssignmentId: assignment._id, 
            studentId: userId 
        });
        
        return {
            ...assignment.toObject(),
            attemptStatus: attempt ? attempt.status : 'NOT_STARTED', // STARTED, SUBMITTED, COMPLETED
            attemptId: attempt ? attempt._id : null
        };
    }));

    return NextResponse.json(assignmentsWithStatus);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
