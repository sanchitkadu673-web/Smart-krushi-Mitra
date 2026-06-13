import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import cropRoutes from './routes/crops';
import recommendationRoutes from './routes/recommendations';
import notificationRoutes from './routes/notifications';
import weatherRoutes from './routes/weather';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate Limiting – more relaxed in development
const isDev = process.env.NODE_ENV !== 'production';

// General API limiter – high for development comfort
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 2000 : 300,   // 2000 req/15min in dev, 300 in production
  message: { error: 'Too many requests, please try again later.' },
  skip: () => isDev           // Completely skip rate limiting in dev mode
});
app.use('/api/', limiter);

// Request Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Smart Krushi Mitra server running on port ${PORT}`);
  });
}

export default app;
