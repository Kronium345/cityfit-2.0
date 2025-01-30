import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, View, ImageBackground, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router"; // Assuming you're using expo-router
import Result from "../Result/Result";

const Quiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [err, setErr] = useState(null);

  // Fetch quiz questions from the backend API when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://192.168.1.212:5000/quiz/quiz'); // Use your backend's /quiz route
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);  // Set the fetched questions in state
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Function to handle user selection of options for each question
  const handleOptionPress = ({ name, value }) => {
    const updatedQuestions = questions.map((q) => {
      if (q.name === name) {
        return { ...q, selected: value };  // Update the selected option
      }
      return q;
    });
    setQuestions(updatedQuestions);  // Update state with new selected options
  };

  // Function to send the answers to the backend for prediction
const handleSubmit = async () => {
  let features = {};
  let isError = false;

  questions.forEach((question) => {
    if (question.selected !== null) {
      features[question.name] = question.selected;
    } else {
      isError = true;
      setErr(`Please select an option for the question "${question.text}"`);
    }
  });

  if (!isError) {
    try {
      // Send a POST request with the quiz answers to the backend
      const response = await fetch('http://192.168.1.212:5000/quiz/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),  // Send the selected answers as the body
      });

      // Log the response to check if it's correct
      const data = await response.json();
      console.log("Prediction Response:", data);  // Log the entire response to the console

      // Check if the response contains the expected fields
      if (data.msg === 'success' && data.prediction) {
        setErr(null);
        setPrediction({
          category: data.category,  // Set the category from the response
          description: data.description,  // Set the description from the response
        });
      } else {
        setPrediction(null);
        setErr('Having trouble connecting to the classifier model. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErr('An error occurred. Please try again.');
    }
  }
};

  

  // Function to reset the quiz
  const resetQuiz = () => {
    setQuestions([]);  // Clear the questions
    setPrediction(null);  // Clear the prediction
    setErr(null);  // Clear any error messages
  };

  // Function to render each question card
  const QuestionCard = ({ question }) => {
    return (
      <View style={styles.card}>
        <ImageBackground source={require("../../assets/images/result-bg.jpg")} style={styles.hospitalItem}>
          <View style={styles.top}>
            <Text style={styles.question}>{question.text}</Text>
          </View>
          <View style={styles.middle}>
            {question.options.map((op) => (
              <TouchableOpacity
                style={[styles.option, question.selected === op.value && styles.selectedOption]}
                key={op.text}
                onPress={() => handleOptionPress({ name: question.name, value: op.value })}
              >
                <Text style={styles.optionText}>{op.text}</Text>
                {question.selected === op.value && (
                  <Icon name="check-circle" size={20} color="white" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {prediction ? (
        <Result prediction={prediction} resetQuiz={resetQuiz} />  // Show the result if prediction is available
      ) : (
        <ScrollView style={styles.container}>
          {questions.map((question) => (
            <QuestionCard key={question.name} question={question} />  // Render each question
          ))}
          {err && <Text style={styles.errText}>{err}</Text>} 

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.optionText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  hospitalItem: {
    padding: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  top: {},
  question: {
    fontSize: 22,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  middle: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  option: {
    backgroundColor: "#FC734D",
    marginVertical: 6,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: "row",
  },
  selectedOption: {
    backgroundColor: "gray",
  },
  optionText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    width: "100%",
  },
  checkIcon: {
    marginLeft: "-15%",
  },
  errText: {
    color: "red",
    marginHorizontal: 10,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  submitBtn: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 5,
  },
});

export default Quiz;
