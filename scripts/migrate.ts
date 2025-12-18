/**
 * Data Migration Script
 * Migrates existing data to new schema with multi-tenancy support
 * 
 * Run with: pnpm run migrate
 */

import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Organization from '../models/Organization';
import User from '../models/User';
import Exam from '../models/Exam';
import Question from '../models/question';
import AnswerOption from '../models/AnswerOption';
import ExamQuestion from '../models/ExamQuestion';

async function migrate() {
  try {
    console.log('🔄 Starting data migration...\n');
    
    await dbConnect();

    // Step 1: Create default organization for existing data
    console.log('📦 Step 1: Creating default organization...');
    let defaultOrg = await Organization.findOne({ email: 'default@cbt.com' });
    
    if (!defaultOrg) {
      defaultOrg = await Organization.create({
        name: 'Default Organization',
        type: 'SCHOOL',
        email: 'default@cbt.com',
        phone: '+234-000-000-0000',
        address: 'Migration - Default Organization',
        status: 'ACTIVE',
      });
      console.log(`✅ Default organization created: ${defaultOrg._id}\n`);
    } else {
      console.log(`✅ Default organization already exists: ${defaultOrg._id}\n`);
    }

    // Step 2: Migrate existing users
    console.log('👥 Step 2: Migrating existing users...');
    const usersToMigrate = await User.find({
      $or: [
        { organizationId: { $exists: false } },
        { status: { $exists: false } },
        { role: { $in: ['examiner', 'examinee'] } }
      ]
    });

    console.log(`Found ${usersToMigrate.length} users to migrate`);

    for (const user of usersToMigrate) {
      const updates: any = {};

      // Add organizationId if missing
      if (!user.organizationId) {
        updates.organizationId = defaultOrg._id;
      }

      // Add status if missing (set to ACTIVE for existing users)
      if (!user.status) {
        updates.status = 'ACTIVE';
        updates.approvedAt = new Date();
      }

      // Update old roles to new roles
      if (user.role === 'examiner') {
        updates.role = 'TEACHER';
      } else if (user.role === 'examinee') {
        updates.role = 'STUDENT';
      }

      if (Object.keys(updates).length > 0) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        console.log(`  ✓ Migrated user: ${user.email} (${updates.role || user.role})`);
      }
    }
    console.log(`✅ Migrated ${usersToMigrate.length} users\n`);

    // Step 3: Migrate existing exams
    console.log('📝 Step 3: Migrating existing exams...');
    const examsToMigrate = await Exam.find({
      $or: [
        { organizationId: { $exists: false } },
        { shuffleQuestions: { $exists: false } }
      ]
    });

    console.log(`Found ${examsToMigrate.length} exams to migrate`);

    for (const exam of examsToMigrate) {
      const updates: any = {};

      // Add organizationId if missing
      if (!exam.organizationId) {
        updates.organizationId = defaultOrg._id;
      }

      // Add shuffle settings if missing
      if (exam.shuffleQuestions === undefined) {
        updates.shuffleQuestions = true;
        updates.shuffleOptions = true;
      }

      // Add new fields with defaults
      if (!exam.showResultsImmediately) {
        updates.showResultsImmediately = false;
      }
      if (!exam.allowReview) {
        updates.allowReview = true;
      }
      if (!exam.maxAttempts) {
        updates.maxAttempts = 1;
      }

      // Rename examinerId to createdBy if exists
      if ((exam as any).examinerId && !exam.createdBy) {
        updates.createdBy = (exam as any).examinerId;
      }

      if (Object.keys(updates).length > 0) {
        await Exam.updateOne({ _id: exam._id }, { $set: updates });
        console.log(`  ✓ Migrated exam: ${exam.title}`);
      }

      // Step 3a: Migrate embedded questions to ExamQuestion model
      if ((exam as any).questions && Array.isArray((exam as any).questions)) {
        const embeddedQuestions = (exam as any).questions;
        console.log(`  📋 Migrating ${embeddedQuestions.length} embedded questions for exam: ${exam.title}`);

        for (let i = 0; i < embeddedQuestions.length; i++) {
          const embeddedQ = embeddedQuestions[i];

          // Create standalone Question if it doesn't exist
          const questionData = {
            questionText: embeddedQ.questionText,
            type: embeddedQ.type || 'multiple-choice',
            subject: exam.subject || 'General',
            difficulty: 'medium',
            points: embeddedQ.points || 1,
            organizationId: exam.organizationId || defaultOrg._id,
            createdBy: exam.createdBy || (exam as any).examinerId,
          };

          const question = await Question.create(questionData);

          // Create AnswerOptions if options exist
          if (embeddedQ.options && Array.isArray(embeddedQ.options)) {
            for (let j = 0; j < embeddedQ.options.length; j++) {
              const optionText = embeddedQ.options[j];
              const isCorrect = embeddedQ.correctAnswer === j || embeddedQ.correctAnswer === optionText;

              await AnswerOption.create({
                questionId: question._id,
                optionText,
                isCorrect,
                displayOrder: j,
              });
            }
          }

          // Create ExamQuestion link
          await ExamQuestion.create({
            examId: exam._id,
            questionId: question._id,
            questionOrder: i + 1,
            marks: embeddedQ.points || 1,
          });

          console.log(`    ✓ Migrated question ${i + 1}: ${embeddedQ.questionText.substring(0, 50)}...`);
        }

        // Remove embedded questions from exam
        await Exam.updateOne(
          { _id: exam._id },
          { $unset: { questions: '' } }
        );
      }
    }
    console.log(`✅ Migrated ${examsToMigrate.length} exams\n`);

    // Step 4: Migrate standalone questions
    console.log('❓ Step 4: Migrating standalone questions...');
    const questionsToMigrate = await Question.find({
      $or: [
        { organizationId: { $exists: false } },
        { createdBy: { $exists: false } }
      ]
    });

    console.log(`Found ${questionsToMigrate.length} questions to migrate`);

    for (const question of questionsToMigrate) {
      const updates: any = {};

      if (!question.organizationId) {
        updates.organizationId = defaultOrg._id;
      }

      if (!question.createdBy && (question as any).examinerId) {
        updates.createdBy = (question as any).examinerId;
      }

      if (Object.keys(updates).length > 0) {
        await Question.updateOne({ _id: question._id }, { $set: updates });
        console.log(`  ✓ Migrated question: ${question.questionText.substring(0, 50)}...`);
      }

      // Migrate embedded options to AnswerOption model
      if ((question as any).options && Array.isArray((question as any).options)) {
        const embeddedOptions = (question as any).options;
        
        // Check if options already migrated
        const existingOptions = await AnswerOption.countDocuments({ questionId: question._id });
        
        if (existingOptions === 0 && embeddedOptions.length > 0) {
          for (let i = 0; i < embeddedOptions.length; i++) {
            const optionText = embeddedOptions[i];
            const isCorrect = (question as any).correctAnswer === i || (question as any).correctAnswer === optionText;

            await AnswerOption.create({
              questionId: question._id,
              optionText,
              isCorrect,
              displayOrder: i,
            });
          }
          console.log(`    ✓ Migrated ${embeddedOptions.length} options`);

          // Remove embedded options
          await Question.updateOne(
            { _id: question._id },
            { $unset: { options: '', correctAnswer: '' } }
          );
        }
      }
    }
    console.log(`✅ Migrated ${questionsToMigrate.length} questions\n`);

    // Summary
    console.log('📊 Migration Summary:');
    console.log(`   - Default Organization: ${defaultOrg.name} (${defaultOrg._id})`);
    console.log(`   - Users migrated: ${usersToMigrate.length}`);
    console.log(`   - Exams migrated: ${examsToMigrate.length}`);
    console.log(`   - Questions migrated: ${questionsToMigrate.length}`);
    
    const totalUsers = await User.countDocuments();
    const totalOrgs = await Organization.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalOptions = await AnswerOption.countDocuments();
    const totalExamQuestions = await ExamQuestion.countDocuments();

    console.log('\n📈 Current Database State:');
    console.log(`   - Organizations: ${totalOrgs}`);
    console.log(`   - Users: ${totalUsers}`);
    console.log(`   - Exams: ${totalExams}`);
    console.log(`   - Questions: ${totalQuestions}`);
    console.log(`   - Answer Options: ${totalOptions}`);
    console.log(`   - Exam-Question Links: ${totalExamQuestions}`);

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
