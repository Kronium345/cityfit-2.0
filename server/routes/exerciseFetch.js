import express from 'express';
import Exercise from '../models/Exercise.js';  // Assuming Exercise model is in the models folder

const router = express.Router();

// Fetch exercise details by ID
router.get('/exercises/:exerciseId', async (req, res) => {
    const exerciseId = parseInt(req.params.exerciseId, 10);  // Ensure you convert param to a number
    try {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }
      res.status(200).json(exercise);
    } catch (error) {
      console.error('Error fetching exercise details:', error);
      res.status(500).json({ message: 'Failed to fetch exercise details', error: error.message });
    }
  });
  

export default router;
