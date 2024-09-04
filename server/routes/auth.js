// routes/auth.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, dob } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, dob });
    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error('Error during signup:', error.message || error);
    res.status(500).json({ message: 'Something went wrong on the server.', error: error.message || error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Respond with the user data and token
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error('Error during login:', error.message || error);
    res.status(500).json({ message: 'Something went wrong on the server.', error: error.message || error });
  }
});

// In your routes/auth.js

router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { weight, experience, gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { weight, experience, gender },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


export default router;
