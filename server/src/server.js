import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getIsMongoConnected } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import verifierRoutes from './routes/verifierRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'SkillChain Verifiable Skill Passport API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongoConnected: getIsMongoConnected(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verify', verifierRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`SkillChain Backend API running on http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Database: ${getIsMongoConnected() ? 'MongoDB (Connected)' : 'High-Availability In-Memory Store (Ready)'}`);
    console.log(`====================================================`);
  });
}

export default app;

