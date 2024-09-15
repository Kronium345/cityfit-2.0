// routes/exerciseHistory.js
import express from 'express';
import ExerciseHistory from '../models/ExerciseHistory.js';
import Exercise from '../models/Exercise.js';  // Adjust the path to where the model is defined
import mongoose from 'mongoose';

const router = express.Router();

router.post('/history', async (req, res) => {
  const { userId, exerciseId, sets, reps, weight } = req.body;

  // Validate inputs
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(exerciseId)) {
    return res.status(400).json({ message: "Invalid userId or exerciseId" });
  }
  if (!Number.isFinite(sets) || !Number.isFinite(reps) || !Number.isFinite(weight)) {
    return res.status(400).json({ message: "Sets, reps, and weight must be valid numbers" });
  }

  try {
    const newEntry = new ExerciseHistory({
      userId,
      exerciseId,
      sets,
      reps,
      weight
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Failed to log exercise:", error);
    res.status(500).json({ message: "Failed to log exercise", error: error.message });
  }
});


router.get('/:userId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  
  try {
    const history = await ExerciseHistory.find({ userId: req.params.userId }).populate({
      path: 'exerciseId',
      model: 'Exercise',
      select: 'name' // Make sure the exerciseId refers to an actual ObjectId
    });

    res.status(200).json(history.map(entry => ({
      ...entry._doc,
      exerciseId: entry.exerciseId ? entry.exerciseId.name : "Unknown Exercise"
    })));
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    res.status(500).json({ message: "Failed to fetch history", error: error.toString() });
  }
});


export default router;
