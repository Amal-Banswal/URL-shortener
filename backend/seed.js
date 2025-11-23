require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Link = require('./models/Link');

async function seed() {
  const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/url_shortener_db';
  await mongoose.connect(MONGO, {});
  console.log('Connected to DB');

  // create demo user
  const email = 'demo@example.com';
  await User.deleteMany({ email });
  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await User.create({ email, passwordHash });
  console.log('Created user', user.email);

  // create demo links
  await Link.deleteMany({ owner: user._id });
  const samples = [
    { slug: 'openai', url: 'https://openai.com' },
    { slug: 'google', url: 'https://google.com' },
    { slug: 'github', url: 'https://github.com' }
  ];
  for (const s of samples) {
    await Link.create({ ...s, owner: user._id, clicks: [{ ua: 'demo-agent', ts: new Date() }] });
  }
  console.log('Seeded links');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });