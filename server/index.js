import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import dealRoutes from './routes/deals.js';
import reviewRoutes from './routes/reviews.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});