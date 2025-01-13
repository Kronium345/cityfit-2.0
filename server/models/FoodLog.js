import mongoose from 'mongoose';

// Schema for Food Log
const FoodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to user
  label: { type: String, required: true },  // Food label (e.g., "Pizza")
  cal: { type: Number, required: true },  // Calories consumed for the food item
  carbohydrates: { type: Number, required: true },  // Carbs per 100g
  fats: { type: Number, required: true },  // Fats per 100g
  proteins: { type: Number, required: true },  // Proteins per 100g
  sugars: { type: Number, required: true },  // Sugars per 100g
  imageUrl: { type: String, default: 'N/A' },  // Image URL (if available)
});

const FoodLog = mongoose.model('FoodLog', FoodLogSchema);

export default FoodLog;
