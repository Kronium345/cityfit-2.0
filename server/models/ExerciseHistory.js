// ExerciseHistory.js (MongoDB Model)
import mongoose from 'mongoose';

const exerciseHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  exerciseId: {
    type: String,
    required: true,
    ref: 'Exercise'  // Only use this if you actually have an Exercise model to reference
  },   
  sets: Number,
  reps: Number,
  weight: Number,
  dateLogged: { type: Date, default: Date.now }
});


const ExerciseHistory = mongoose.model('ExerciseHistory', exerciseHistorySchema);

export default ExerciseHistory;
