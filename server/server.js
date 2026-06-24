import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import scrapbookRoutes from './routes/scrapbook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : '';
    const allowedOrigins = [
      clientUrl,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175'
    ];

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scrapbook', scrapbookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌍 The Unplanned Journey API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`\n🌍 The Unplanned Journey Server`);
  console.log(`🚀 Running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
