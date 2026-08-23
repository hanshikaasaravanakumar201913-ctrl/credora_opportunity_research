import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Credora Backend API',
    tagline: 'Research. Compare. Verify. Decide.',
    docs: '/api/health',
    status: 'online'
  });
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log('===================================================');
  console.log(`🚀 Credora API Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Tagline: "Research. Compare. Verify. Decide."`);
  console.log('===================================================');
});

export default app;
