import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
// Import routes
import authRoutes from './routes/auth.route.js';
import healthRouter from './routes/health';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

export default app;
