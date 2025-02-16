import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 6); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text]);

  return <Text style={styles.messageText}>{displayedText}</Text>;
};

const PlanScreen = () => {
  const [input, setInput] = useState('');  // User's fitness goal input
  const [plan, setPlan] = useState([]);  // Store the generated plans (multiple responses)
  const [loading, setLoading] = useState(false);  // Loading state

  // Add new state for typing animation
  const [isTyping, setIsTyping] = useState(false);

  // Add new state for input height
  const [inputHeight, setInputHeight] = useState(40);

  // Welcome message
  React.useEffect(() => {
    setPlan([
      "Hello! I'm your personal fitness AI assistant. Tell me your fitness goals, and I'll create a customized workout plan for you. 🏋️‍♂️"
    ]);
  }, []);

  const generatePlan = async () => {
    if (input.trim() === '') return;  // Prevent empty inputs
    const cohereApiKey = Constants.expoConfig?.extra?.cohereApiKey || "";

    // Log API key to ensure it's being fetched correctly (for debugging)
    console.log("Cohere API Key:", Constants.expoConfig?.extra?.cohereApiKey);

    // Add user message to chat
    setPlan(prevPlans => [...prevPlans, { type: 'user', text: input }]);
    setInput(''); // Clear input
    setInputHeight(40); // Reset height after sending
    setLoading(true);
    setIsTyping(true);

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
            'Authorization': `Bearer ${cohereApiKey}`,  // API key from environment
            'Content-Type': 'application/json',
          },
        }
      );

      // Modify how we add the AI response
      setPlan(prevPlans => [
        ...prevPlans,
        { type: 'bot', text: response.data.generations[0].text }
      ]);

    } catch (error) {
      console.error('Error generating plan:', error);
      setPlan(prevPlans => [
        ...prevPlans,
        { type: 'bot', text: 'There was an error generating your plan. Please try again later.' }
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#004d00', '#003300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >

        <ScrollView style={styles.chatContainer}>
          {plan.map((message, index) => (
            <View
              style={[
                styles.chatBox,
                message.type === 'user' ? styles.userMessage : styles.botMessage,
                message.type === 'user' ? {
                  paddingLeft: 10,
                  paddingRight: 45,
                } : {
                  paddingRight: 10,
                  paddingLeft: 50,
                }
              ]}
              key={index}
            >
              <View style={[
                styles.avatarContainer,
                message.type === 'user' ? {
                  right: 10,
                  marginLeft: 10
                } : {
                  left: 10,
                  marginRight: 10
                }
              ]}>
                <Image
                  source={require('../../../assets/images/logo-img/ai-avatar.png')}
                  style={styles.avatar}
                />
              </View>
              
              {message.type === 'user' ? (
                <Text style={[
                  styles.messageText,
                  message.type === 'user' ? styles.userMessageText : styles.botMessageText,
                  message.type === 'user' ? {
                    marginRight: 5
                  } : {
                    marginLeft: 5
                  }
                ]}>
                  {typeof message === 'string' ? message : message.text}
                </Text>
              ) : (
                <TypewriterText 
                  text={typeof message === 'string' ? message : message.text}
                  onComplete={() => setIsTyping(false)}
                />
              )}
            </View>
          ))}
          {isTyping && (
            <View style={[styles.chatBox, styles.botMessage, {
              paddingRight: 20,
              paddingLeft: 45,
              marginRight: 'auto'
            }]}>
              {/* AI Avatar */}
              <View style={[
                styles.avatarContainer,
                {
                  left: 10,
                  marginRight: 10
                }
              ]}>
                <Image
                  source={require('../../../assets/images/logo-img/ai-avatar.png')}
                  style={styles.avatar}
                />
              </View>
              
              {/* Typing Indicator */}
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setPlan([])}>
            <Image
              source={require('../../../assets/icons/broom.png')}
              style={styles.clearIcon}
            />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={(text) => {
              setInput(text);
              if (text === '') {
                setInputHeight(40); // Reset height when input is empty
              }
            }}
            placeholder="Enter your fitness goals"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={[
              styles.textInput,
              {
                height: inputHeight
              }
            ]}
            multiline
            numberOfLines={1}
            scrollEnabled={inputHeight >= 80}
            showsVerticalScrollIndicator={inputHeight >= 80}
            onContentSizeChange={(event) => {
              const contentHeight = event.nativeEvent.contentSize.height;
              setInputHeight(Math.min(80, Math.max(40, contentHeight)));
            }}
          />
          <TouchableOpacity
            onPress={generatePlan}
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            disabled={!input.trim()}
          >
            <Image
              source={require('../../../assets/icons/send.png')}
              style={[
                styles.sendIcon,
                !input.trim() && styles.sendIconDisabled
              ]}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Chat Component Start
  chatContainer: {
    flex: 1,
    marginTop: 70,
    marginHorizontal: 4,
  },
  chatBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    position: 'relative',
    width: '100%',
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  botMessage: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 1)',
  },
  messageText: {
    backgroundColor: 'rgba(77, 77, 77, 0.85)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: '80%',
    color: '#fff',
    fontSize: 16,
  },
  userMessageText: {
    backgroundColor: 'rgb(7, 82, 0)',
  },
  botMessageText: {
    backgroundColor: 'rgba(77, 77, 77, 0.85)',
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(77, 77, 77, 0.85)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    marginLeft: 5,
  },
  typingText: {
    color: '#fff',
    fontSize: 14,
  },
  // Chat Component End

  // Input Component Start
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 70,
  },
  clearButton: {
    marginRight: 10,
  },
  clearIcon: {
    width: 28,
    height: 28,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,  // 2 lines maximum
    borderRadius: 14,
    backgroundColor: 'rgba(77, 77, 77, 0.7)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'none',
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  sendIconDisabled: {
    tintColor: 'white',
    opacity: 0.5,
  },
  // Input Component End

  icon: {
    marginRight: 10, // Space between icon and text
  },

  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  normalText: {
    color: '#fff',
  },
});

export default PlanScreen;
