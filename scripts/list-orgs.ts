
import dbConnect from '../lib/db';
import Organization from '../models/Organization';

async function listOrgs() {
  await dbConnect();
  const orgs = await Organization.find({});
  console.log('--- ORGANIZATIONS ---');
  orgs.forEach(o => {
    console.log(`ID: ${o._id}, Name: ${o.name}, Email: ${o.email}`);
  });
  if (orgs.length === 0) {
    console.log('No organizations found.');
  }
  process.exit(0);
}

listOrgs();
