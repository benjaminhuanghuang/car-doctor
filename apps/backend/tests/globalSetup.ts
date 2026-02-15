import mongoose from 'mongoose';
import { connectDB } from '../src/config/database';
import { Car } from '../src/models/Car';
import { Maintenance } from '../src/models/Maintenance';
import { User } from '../src/models/User';

export default async function setup() {
  console.log('🗄️  Setting up test database...');

  try {
    await connectDB();
    await Maintenance.deleteMany({});
    await Car.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }

  return async () => {
    console.log('🧹 Tearing down test database...');

    try {
      await Maintenance.deleteMany({});
      await Car.deleteMany({});
      await User.deleteMany({});
      await mongoose.connection.close();

      console.log('✅ Test database teardown complete');
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error);
    }
  };
}
