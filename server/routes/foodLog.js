import express from 'express';
import FoodLog from '../models/FoodLog.js';
import CaloriePreferences from '../models/CaloriePreferences.js';  // Assuming Calorie Preferences are still in use

const router = express.Router();

// POST route for logging food consumption
// POST route for logging food consumption
router.post('/log', async (req, res) => {
    const { userId, label, cal, carbohydrates, fats, proteins, sugars, imageUrl } = req.body;
  
    try {
      // Create a new food log entry
      const foodLogEntry = new FoodLog({
        userId,
        label,
        cal,
        carbohydrates,
        fats,
        proteins,
        sugars,
        imageUrl,
      });
  
      // Save the food log entry to the database
      await foodLogEntry.save();
  
      // Update the user's Calorie Preferences with the logged calories
      const preferences = await CaloriePreferences.findOne({ userId });
      if (preferences) {
        const totalCalories = preferences.dailyCalorieIntake + cal;
        preferences.dailyCalorieIntake = totalCalories;
        await preferences.save();
      }
  
      res.status(201).send(foodLogEntry);  // Return the logged food entry as a response
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

// GET route for fetching the food log by userId
router.get('/log/:userId', async (req, res) => {
  try {
    const foodLog = await FoodLog.find({ userId: req.params.userId });
    if (!foodLog) {
      return res.status(404).send({ message: 'No food logs found for this user' });
    }
    res.send(foodLog);  // Return the food logs
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
