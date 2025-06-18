import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import playerRoutes from './routes/playerRoutes';
import draftRoutes from './routes/draftRoutes';
import userRoutes from './routes/userRoutes';
import analysisRoutes from './routes/analysisRoutes';
import mockDraftRoutes from './routes/mockDraftRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Define routes
app.use('/api/players', playerRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/mock', mockDraftRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API documentation route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Fantasy Basketball Draft Assistant API',
    documentation: 'https://github.com/dxaginfo/fantasy-basketball-draft-board',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});