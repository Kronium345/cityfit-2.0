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

// Update user password
router.patch('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
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

// Correctly handle file upload and store avatar path
router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;

  // If file is available
  if (req.file) {
    const avatarPath = req.file.path ? req.file.path : req.body.avatar; // Correct file path received from multer

    try {
      const updatedUser = await User.findByIdAndUpdate(id, { avatar: avatarPath }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);  // Return updated user with avatar path
    } catch (error) {
      console.error('Error updating avatar:', error);
      return res.status(500).json({ message: 'Error updating avatar', error: error.message });
    }
  }

  // If avatar URL is provided (pre-selected avatar)
  if (req.body.avatar) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { avatar: req.body.avatar }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(updatedUser);  // Return updated user with avatar URL
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
