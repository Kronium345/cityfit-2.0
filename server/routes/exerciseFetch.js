import express from 'express';
import ExerciseHistory from '../models/ExerciseHistory.js';

const router = express.Router();

// Fetch all exercise history for a user (no filtering based on exerciseName)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all exercises for the user
    const history = await ExerciseHistory.find({ userId });
    
    // If no history is found, return a message
    if (history.length === 0) {
      return res.status(404).json({ message: 'No exercises found for this user' });
    }

    res.json(history);
  } catch (error) {
    console.error("Failed to fetch exercise history:", error);
    res.status(500).json({ message: 'Error fetching history', error });
  }
});

export default router;
