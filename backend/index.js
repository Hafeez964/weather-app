import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

dotenv.config();
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
// Connect to database
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/weather', weatherRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  aapp.use(express.static(join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => 
    res.sendFile(join(__dirname, '../frontend/dist/index.html'))

  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export for Vercel
export default app;