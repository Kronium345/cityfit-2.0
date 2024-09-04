// PlanScreen.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import axios from 'axios';

const PlanScreen = () => {
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState(null);

  const generatePlan = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `Generate a workout plan for ${input}`,
        max_tokens: 100,
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        }
      });

      setPlan(response.data.choices[0].text);
    } catch (error) {
      console.error('Error generating plan:', error);
    }
  };

  return (
    <View>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter your fitness goals"
      />
      <Button title="Generate Plan" onPress={generatePlan} />
      {plan && (
        <Text>{plan}</Text>
      )}
    </View>
  );
};

export default PlanScreen;
