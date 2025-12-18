
import dbConnect from '../lib/db';
import User from '../models/User';

async function checkUsers() {
  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 });
  console.log('--- USERS ---');
  users.forEach(u => {
    console.log(`Email: ${u.email}, Role: ${u.role}, Org: ${u.organizationId}, Status: ${u.status}`);
  });
  process.exit(0);
}

checkUsers();
