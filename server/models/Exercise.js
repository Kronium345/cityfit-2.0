import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    _id: { type: Number, required: true },  // Using Number as the type for _id
    name: { type: String, required: true },
    description: String,
  });
  
  const Exercise = mongoose.model('Exercise', exerciseSchema);
  
  export default Exercise;
  
