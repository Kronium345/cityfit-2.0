// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  gender: { type: String, default: null },
  dob: { type: Date },
  experience: { type: String, default: null },
  avatar: { type: String, default: null },  // New avatar field
  weight: { type: Number, default: null },
  unit: { type: String, default: 'kg' },
});

const User = mongoose.model('User', UserSchema);

export default User;
