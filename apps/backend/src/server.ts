import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
// Import routes
import authRoutes from './routes/authRoutes.js';
import healthRouter from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
// DB
import { connectDB } from './config/database';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Allow larger JSON/urlencoded request bodies (5 megabytes)
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.use('/api/health', healthRouter);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
