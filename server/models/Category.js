import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  label: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  suggestion: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
