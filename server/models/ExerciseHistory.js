import mongoose from 'mongoose';

const exerciseHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  exerciseName: {
    type: String,  // Store the exercise name instead of ObjectId
    required: true,
  },
  sets: Number,
  reps: Number,
  weight: Number,
  isFavorite: { // New field for favorite status
    type: Boolean,
    default: false, // Default to false
  },
  dateLogged: { type: Date, default: Date.now }
});

const ExerciseHistory = mongoose.model('ExerciseHistory', exerciseHistorySchema);

export default ExerciseHistory;
