import express from 'express';
import ExerciseHistory from '../models/ExerciseHistory.js';  // Updated import
import mongoose from 'mongoose';

const router = express.Router();

router.post('/history', async (req, res) => {
  console.log("POST request received at /history");
  const { userId, exerciseName, sets, reps, weight } = req.body;

  console.log("Received Exercise Name:", exerciseName);  // Log to check the received exerciseName

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (!exerciseName || !Number.isFinite(sets) || !Number.isFinite(reps) || !Number.isFinite(weight)) {
    return res.status(400).json({ message: "Exercise name, sets, reps, and weight must be valid" });
  }

  try {
    const newEntry = new ExerciseHistory({
      userId,
      exerciseName,  // Store exercise name directly
      sets,
      reps,
      weight
    });
    await newEntry.save();
    res.status(201).json(newEntry);  // Return the new log entry
  } catch (error) {
    console.error("Failed to log exercise:", error);
    res.status(500).json({ message: "Failed to log exercise", error: error.message });
  }
});

router.post('/toggle-favorite', async (req, res) => {
  const { userId, exerciseName } = req.body;

  try {
    let exercise = await ExerciseHistory.findOne({ userId, exerciseName });

    if (!exercise) {
      exercise = new ExerciseHistory({
        userId,
        exerciseName,
        isFavorite: true,  // Initial favorite status
      });
      await exercise.save();  // Save the new favorite
    } else {
      exercise.isFavorite = !exercise.isFavorite;  // Toggle favorite status
      await exercise.save();
    }

    res.status(200).json({ message: 'Favorite status updated', exercise });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Failed to toggle favorite status', error: error.message });
  }
});


router.get('/favorites/:userId', async (req, res) => {
  try {
    const favorites = await ExerciseHistory.find({ userId: req.params.userId, isFavorite: true });
    res.status(200).json(favorites);  // Send the list of favorite exercises
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
});




export default router;
