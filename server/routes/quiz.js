// routes/quiz.js
import express from 'express';
import Question from '../models/Question.js';  // Assuming you're using this model for quiz questions
import Category from '../models/Category.js';

const router = express.Router();

// Rule-based prediction logic
const getPrediction = (features) => {
  let anxietyLevel = 0;

  // Example rule-based logic: Calculate a simple "anxiety level" score based on answers
  console.log("Features for prediction:", features); // Log the features being received

  if (features['angerAnxiety'] && features['angerAnxiety'] > 3) {
    anxietyLevel += 1;  // Increase anxiety level if answer is above threshold
  }

  if (features['exercise'] && features['exercise'] < 3) {
    anxietyLevel += 1;  // Increase anxiety level for low exercise score
  }

  if (features['doctor'] && features['doctor'] > 3) {
    anxietyLevel -= 1;  // Decrease anxiety level for answers indicating they see a doctor
  }

  // Log the calculated anxiety level
  console.log("Calculated anxiety level:", anxietyLevel);

  // Categorize anxiety levels
  if (anxietyLevel >= 2) {
    return { msg: 'success', prediction: 'High Anxiety' };
  } else if (anxietyLevel === 1) {
    return { msg: 'success', prediction: 'Moderate Anxiety' };
  } else {
    return { msg: 'success', prediction: 'Low Anxiety' };
  }
};

// Fetch quiz questions from MongoDB
router.get('/quiz', async (req, res) => {
  try {
    const questions = await Question.find();  // Get all questions from MongoDB
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Route to insert quiz questions into MongoDB
router.post('/addQuestions', async (req, res) => {
  try {
    const questionsData = req.body;  // Get the questions from the frontend (as an array)
  
    // Insert the questions into the database
    const result = await Question.insertMany(questionsData);
  
    // Return success response with inserted questions
    res.status(201).json({ msg: 'Questions added successfully', result });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to add questions', error: error.message });
  }
});

// Route to insert categories into MongoDB
router.post('/addCategories', async (req, res) => {
  try {
    const categoriesData = req.body;  // Get the categories from the frontend (as an array)
    const result = await Category.insertMany(categoriesData);  // Insert categories into MongoDB
    res.status(201).json({ msg: 'Categories added successfully', result });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to add categories', error: error.message });
  }
});

// Prediction route to classify anxiety level based on quiz answers
router.post('/predict', async (req, res) => {
  const features = req.body;  // Get the quiz answers (features) from the frontend
  console.log("Features for prediction:", features); // Log the received features

  try {
    const prediction = getPrediction(features);  // Run the prediction based on the answers
    console.log("Calculated prediction:", prediction.prediction);  // Log the prediction value

    // Fetch category details from the database based on the prediction
    const category = await Category.findOne({ category: prediction.prediction });
    console.log("Category from DB:", category); // Log the category fetched from the database

    if (category) {
      res.json({
        msg: 'success',
        prediction: prediction.prediction,
        category: category.category,
        description: category.description,
        suggestion: category.suggestion,  // Include suggestions from the categories data
      });
    } else {
      res.status(404).json({ msg: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'error', error: error.message });
  }
});

export default router;
