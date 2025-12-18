/**
 * Database Seed Script
 * Creates initial data for testing the CBT platform
 * 
 * Run with: node --loader ts-node/esm scripts/seed.ts
 * Or add to package.json: "seed": "tsx scripts/seed.ts"
 */

import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Organization from '../models/Organization';
import User from '../models/User';
import Class from '../models/Class';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    await dbConnect();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Class.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Super Admin
    console.log('👤 Creating Super Admin...');
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@cbt.com',
      password: 'admin123', // Will be hashed automatically
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+234-800-000-0000',
    });
    console.log(`✅ Super Admin created: ${superAdmin.email}\n`);

    // Create Sample Organization 1 - School
    console.log('🏫 Creating Sample School...');
    const school = await Organization.create({
      name: 'Green Valley Secondary School',
      type: 'SCHOOL',
      email: 'info@greenvalley.edu',
      phone: '+234-800-111-1111',
      address: '123 Education Lane, Lagos, Nigeria',
      status: 'ACTIVE',
    });
    console.log(`✅ School created: ${school.name}\n`);

    // Create Sample Organization 2 - Tutorial Center
    console.log('📚 Creating Sample Tutorial Center...');
    const tutorialCenter = await Organization.create({
      name: 'Excellence Tutorial Center',
      type: 'TUTORIAL_CENTER',
      email: 'info@excellence.com',
      phone: '+234-800-222-2222',
      address: '456 Learning Street, Abuja, Nigeria',
      status: 'ACTIVE',
    });
    console.log(`✅ Tutorial Center created: ${tutorialCenter.name}\n`);

    // Create Organization Admin for School
    console.log('👔 Creating Organization Admin for School...');
    const schoolAdmin = await User.create({
      name: 'John Doe',
      email: 'admin@greenvalley.edu',
      password: 'admin123',
      role: 'ORG_ADMIN',
      organizationId: school._id,
      status: 'ACTIVE',
      phone: '+234-800-333-3333',
    });
    console.log(`✅ School Admin created: ${schoolAdmin.email}\n`);

    // Create Organization Admin for Tutorial Center
    console.log('👔 Creating Organization Admin for Tutorial Center...');
    const centerAdmin = await User.create({
      name: 'Jane Smith',
      email: 'admin@excellence.com',
      password: 'admin123',
      role: 'ORG_ADMIN',
      organizationId: tutorialCenter._id,
      status: 'ACTIVE',
      phone: '+234-800-444-4444',
    });
    console.log(`✅ Tutorial Center Admin created: ${centerAdmin.email}\n`);

    // Create Sample Teachers for School
    console.log('👨‍🏫 Creating Sample Teachers...');
    const teacher1 = await User.create({
      name: 'Mr. David Wilson',
      email: 'david@greenvalley.edu',
      password: 'teacher123',
      role: 'TEACHER',
      organizationId: school._id,
      status: 'ACTIVE',
      phone: '+234-800-555-5555',
    });

    const teacher2 = await User.create({
      name: 'Mrs. Sarah Johnson',
      email: 'sarah@greenvalley.edu',
      password: 'teacher123',
      role: 'TEACHER',
      organizationId: school._id,
      status: 'ACTIVE',
      phone: '+234-800-666-6666',
    });
    console.log(`✅ Teachers created: ${teacher1.email}, ${teacher2.email}\n`);

    // Create Classes for School
    console.log('🎓 Creating Sample Classes...');
    const class1 = await Class.create({
      organizationId: school._id,
      name: 'JSS1-A',
      level: 'JSS1',
      section: 'A',
      academicYear: '2024/2025',
      createdBy: schoolAdmin._id,
    });

    const class2 = await Class.create({
      organizationId: school._id,
      name: 'JSS2-B',
      level: 'JSS2',
      section: 'B',
      academicYear: '2024/2025',
      createdBy: schoolAdmin._id,
    });

    const class3 = await Class.create({
      organizationId: school._id,
      name: 'SS1-A',
      level: 'SS1',
      section: 'A',
      academicYear: '2024/2025',
      createdBy: schoolAdmin._id,
    });
    console.log(`✅ Classes created: ${class1.name}, ${class2.name}, ${class3.name}\n`);

    // Create Sample Students (PENDING status)
    console.log('👨‍🎓 Creating Sample Students...');
    const student1 = await User.create({
      name: 'Alice Brown',
      email: 'alice@student.com',
      password: 'student123',
      role: 'STUDENT',
      organizationId: school._id,
      status: 'PENDING', // Needs approval
      phone: '+234-800-777-7777',
    });

    const student2 = await User.create({
      name: 'Bob Martin',
      email: 'bob@student.com',
      password: 'student123',
      role: 'STUDENT',
      organizationId: school._id,
      status: 'ACTIVE', // Already approved
      phone: '+234-800-888-8888',
      approvedBy: schoolAdmin._id,
      approvedAt: new Date(),
    });
    console.log(`✅ Students created: ${student1.email} (PENDING), ${student2.email} (ACTIVE)\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - 1 Super Admin: admin@cbt.com / admin123`);
    console.log(`   - 2 Organizations: School & Tutorial Center`);
    console.log(`   - 2 Org Admins: admin@greenvalley.edu / admin123, admin@excellence.com / admin123`);
    console.log(`   - 2 Teachers: david@greenvalley.edu / teacher123, sarah@greenvalley.edu / teacher123`);
    console.log(`   - 3 Classes: JSS1-A, JSS2-B, SS1-A`);
    console.log(`   - 2 Students: alice@student.com (PENDING), bob@student.com (ACTIVE) / student123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
