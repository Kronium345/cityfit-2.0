// models/Question.js
import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: Number, required: true }
});

const QuestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  options: [OptionSchema],
  selected: { type: Number, default: null }
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question;
