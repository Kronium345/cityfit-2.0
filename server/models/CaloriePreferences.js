import mongoose from 'mongoose';

const CaloriePreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentWeight: { type: Number, required: true },
  goalWeight: { type: Number },
  dailyCalorieIntake: { type: Number },
  activityLevel: { type: String, enum: ['Little', 'Light', 'Moderate', 'Heavy'], required: true },
  mealPreferences: {
    breakfast: Boolean,
    morningSnack: Boolean,
    lunch: Boolean,
    afternoonSnack: Boolean,
    dinner: Boolean,
    eveningSnack: Boolean
  },
  createdAt: { type: Date, default: Date.now }
});

const CaloriePreferences = mongoose.model('CaloriePreferences', CaloriePreferencesSchema);


export default CaloriePreferences;
