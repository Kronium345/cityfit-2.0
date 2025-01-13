import mongoose from 'mongoose';

const CaloriePreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentWeight: { type: Number, required: true },
  goalWeight: { type: Number },
  dailyCalorieIntake: { type: Number, default: 0 }, // Set default value to 0
  activityLevel: { type: String, enum: ['Little', 'Light', 'Moderate', 'Heavy'], required: true },
  mealPreferences: {
    breakfast: { type: Boolean, default: false },
    morningSnack: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    afternoonSnack: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
    eveningSnack: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

const CaloriePreferences = mongoose.model('CaloriePreferences', CaloriePreferencesSchema);

export default CaloriePreferences;
