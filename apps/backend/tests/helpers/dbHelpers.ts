import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../../src/config/database.ts';
import { Car } from '../../src/models/Car.ts';
import { Maintenance } from '../../src/models/Maintenance.ts';
import { User } from '../../src/models/User.ts';
import { generateToken } from '../../src/utils/jwt.ts';

const ensureDbConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
};

export async function createTestUser(
  userData: Partial<{
    email: string;
    fullName: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePic: string;
  }> = {},
) {
  await ensureDbConnection();

  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    fullName: undefined as string | undefined,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    profilePic: '',
    ...userData,
  };

  const fullName =
    defaultData.fullName ||
    [defaultData.firstName, defaultData.lastName].filter(Boolean).join(' ') ||
    defaultData.username;

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  const hashedPassword = await bcrypt.hash(defaultData.password, saltRounds);

  const user = await User.create({
    email: defaultData.email,
    fullName,
    password: hashedPassword,
    profilePic: defaultData.profilePic,
  });

  const token = await generateToken({
    id: user._id.toString(),
    email: user.email,
    username: user.fullName,
  });

  return { user, token, rawPassword: defaultData.password };
}

export async function cleanupDatabase() {
  await ensureDbConnection();

  await Maintenance.deleteMany({});
  await Car.deleteMany({});
  await User.deleteMany({});
}
