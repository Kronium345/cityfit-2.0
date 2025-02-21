import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path, { dirname } from "path";
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import exerciseHistory from './routes/exerciseHistory.js'; // Ensure you have imported this
import exerciseFetch from './routes/exerciseFetch.js'
import caloriePreferences from './routes/caloriePreferences.js'
import foodLog from './routes/foodLog.js';
import quiz from './routes/quiz.js';
import chat from './routes/aiChat.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Set up the base paths for each route
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/history', exerciseHistory); // Changed from '/exerciseHistory' to '/history'
app.use('/exercise', exerciseFetch);
app.use('/preferences', caloriePreferences);
app.use('/food', foodLog);
app.use('/quiz', quiz);
app.use('/chat', chat);

app.get('/', (req, res) => {
  res.send('Hello, world! Fitness One!.');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
