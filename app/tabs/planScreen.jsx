import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons library
import Constants from 'expo-constants';

const PlanScreen = () => {
  const [input, setInput] = useState('');  // User's fitness goal input
  const [plan, setPlan] = useState([]);  // Store the generated plans (multiple responses)
  const [loading, setLoading] = useState(false);  // Loading state

  const generatePlan = async () => {
    if (input.trim() === '') return;  // Prevent empty inputs

    // Log API key to ensure it's being fetched correctly (for debugging)
    // console.log("Cohere API Key:", Constants.expoConfig.extra.cohereApiKey);

    setLoading(true);  // Show loading spinner/message

    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',  // Cohere API endpoint for text generation
        {
          model: 'command-xlarge-nightly',  // Model name
          prompt: `Generate a workout plan for the following fitness goal: ${input}`,  // Prompt text
          max_tokens: 1000,  // Max tokens for response
        },
        {
          headers: {
            'Authorization': `Bearer ${Constants.expoConfig.extra.cohereApiKey}`,  // API key from environment
            'Content-Type': 'application/json',
          },
        }
      );

      // Append the new plan response to the existing plans
      setPlan(prevPlans => [
        ...prevPlans,
        response.data.generations[0].text
      ]);

    } catch (error) {
      console.error('Error generating plan:', error);
      setPlan(prevPlans => [
        ...prevPlans,
        'There was an error generating your plan. Please try again later.'
      ]);
    } finally {
      setLoading(false);  // Stop loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {loading && <Text style={styles.loadingText}>Generating your plan...</Text>}
        {plan.map((message, index) => (
          <View style={styles.chatBox} key={index}>
            <Text style={styles.messageBot}>
              {message.split('\n').map((part, idx) => (
                <Text key={idx} style={idx === 0 ? styles.boldText : styles.normalText}>
                  {part}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
        ))}
      </ScrollView>


      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Enter your fitness goals"
          style={styles.textInput}
        />
        <TouchableOpacity onPress={generatePlan} style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  messageBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
    color: '#333',
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%',
    marginBottom: 10,
    flexDirection: 'row', // Align icon and text
    alignItems: 'center', // Align icon and text vertically
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  normalText: {
    color: '#333',
  },
});

export default PlanScreen;
