require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ email: 'admin@roomease.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('admin1234', 10);

  const admin = await User.create({
    fullName: 'RoomEase Admin',
    email: 'admin@roomease.com',
    phone: '9800000001',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('Admin created:', admin.email);
  process.exit();
};

run();