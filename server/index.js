import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import exerciseHistory from './routes/exerciseHistory.js'; // Ensure you have imported this
import exerciseFetch from './routes/exerciseFetch.js'
import caloriePreferences from './routes/caloriePreferences.js'
import foodLog from './routes/foodLog.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up the base paths for each route
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/history', exerciseHistory); // Changed from '/exerciseHistory' to '/history'
app.use('/exercise', exerciseFetch);
app.use('/preferences', caloriePreferences);
app.use('/food', foodLog);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
