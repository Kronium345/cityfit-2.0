// routes/user.js
import express from 'express';
import User from '../models/User.js';
import path from 'path';
import multer from 'multer';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Save file with unique timestamp
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
    }
  }
});


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

router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
  console.log('Received file:', req.file);  // Debug log for file
  const { id } = req.params;

  // Check if the file is available
  if (req.file) {
    const avatarPath = req.file.path;

    try {
      const updatedUser = await User.findByIdAndUpdate(id, { avatar: avatarPath }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating avatar:', error);
      return res.status(500).json({ message: 'Error updating avatar', error: error.message });
    }
  }

  // If no file was uploaded, it means the user selected a pre-selected avatar URL
  if (req.body.avatar) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { avatar: req.body.avatar }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating avatar:', error);
      return res.status(500).json({ message: 'Error updating avatar', error: error.message });
    }
  }

  return res.status(400).json({ message: 'Avatar image is required' });
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

// Update user profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, weight, experienceLevel } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, weight, experienceLevel }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
