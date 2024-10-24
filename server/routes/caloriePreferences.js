import express from 'express';
import CaloriePreferences from '../models/CaloriePreferences.js';

const router = express.Router();

// Post or update user preferences
router.post('/preferences', async (req, res) => {
  const { userId, currentWeight, goalWeight, dailyCalorieIntake, activityLevel, mealPreferences } = req.body;
  try {
    let preferences = await CaloriePreferences.findOne({ userId });
    if (preferences) {
      // Update existing preferences
      preferences.currentWeight = currentWeight;
      preferences.goalWeight = goalWeight;
      preferences.dailyCalorieIntake = dailyCalorieIntake;
      preferences.activityLevel = activityLevel;
      preferences.mealPreferences = mealPreferences;
      await preferences.save();
    } else {
      // Create new preferences
      preferences = new CaloriePreferences({ userId, currentWeight, goalWeight, dailyCalorieIntake, activityLevel, mealPreferences });
      await preferences.save();
    }
    res.status(201).send(preferences);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user preferences by user ID
router.get('/preferences/:userId', async (req, res) => {
  try {
    const preferences = await CaloriePreferences.findOne({ userId: req.params.userId });
    if (!preferences) {
      return res.status(404).send();
    }
    res.send(preferences);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
