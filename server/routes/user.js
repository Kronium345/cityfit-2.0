// routes/user.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Update user gender
router.patch('/:id/gender', async (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { gender }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update user experience
router.patch('/:id/experience', async (req, res) => {
  const { id } = req.params;
  const { experience } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { experience }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update user weight
router.patch('/:id/weight', async (req, res) => {
  const { id } = req.params;
  const { weight, unit } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { weight, unit }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get user data
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
