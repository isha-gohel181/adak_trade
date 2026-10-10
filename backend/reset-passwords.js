import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from './models/user.js';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

async function resetPasswords() {
  const mongoUri = process.env.MONGO_URI;
  const newPassword = process.env.RESET_ADMIN_PASSWORD;
  const adminEmail = process.env.RESET_ADMIN_EMAIL?.trim().toLowerCase();

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error('RESET_ADMIN_PASSWORD is required and must be at least 8 characters');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const adminFilter = adminEmail
      ? { email: adminEmail, role: { $in: ['admin', 'super_admin'] } }
      : { role: { $in: ['admin', 'super_admin'] } };

    const resultAdmin = await User.updateMany(
      adminFilter,
      { $set: { password: hashedPassword } }
    );
    console.log(`Updated ${resultAdmin.modifiedCount} admin users.`);
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

resetPasswords();
