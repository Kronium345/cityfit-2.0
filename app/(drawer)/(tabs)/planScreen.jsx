import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, withDelay } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

// Typewriter Effect Start
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
// Typewriter Effect End


const PlanScreen = () => {
  const [input, setInput] = useState('');  // User's fitness goal input
  const [plan, setPlan] = useState([]);  // Store the generated plans (multiple responses)
  const [loading, setLoading] = useState(false);  // Loading state

  // Typing Animation Initial State
  const [isTyping, setIsTyping] = useState(false);

  // Input Height Initial State
  const [inputHeight, setInputHeight] = useState(40);

  // Menu Expansion Initial State
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // Expandable Menu Animation States
  const firstIconAnimation = useSharedValue(0);
  const secondIconAnimation = useSharedValue(0);
  const thirdIconAnimation = useSharedValue(0);

  // Welcome Message
  const welcomeMessage = "Hello! I'm your personal fitness AI assistant. Tell me your fitness goals, and I'll create a customized workout plan for you. 🏋️‍♂️";
  React.useEffect(() => {
    setPlan([welcomeMessage]);
  }, []);
  

  // Menu Toggle Function & Animation Initiation Start
  const toggleMenu = () => {
    if (!isMenuExpanded) {
      // Opening animations - staggered
      firstIconAnimation.value = withDelay(0, withSpring(1, {
        damping: 12,
        stiffness: 90
      }));
      secondIconAnimation.value = withDelay(100, withSpring(1, {
        damping: 12,
        stiffness: 90
      }));
      thirdIconAnimation.value = withDelay(200, withSpring(1, {
        damping: 12,
        stiffness: 90
      }));
      setIsMenuExpanded(true);
    } else {
      // Closing animations - reverse stagger
      thirdIconAnimation.value = withDelay(0, withSpring(0));
      secondIconAnimation.value = withDelay(50, withSpring(0));
      firstIconAnimation.value = withDelay(100, withSpring(0));
      setIsMenuExpanded(false);
    }
  };
  // Menu Toggle Function & Animation Initiation End

  // Menu Icon Styles Start
  const firstIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: firstIconAnimation.value }],
    opacity: firstIconAnimation.value,
  }));

  const secondIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondIconAnimation.value }],
    opacity: secondIconAnimation.value,
  }));

  const thirdIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thirdIconAnimation.value }],
    opacity: thirdIconAnimation.value,
  }));
  // Menu Icon Styles End


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

  // Save Chat Modal Start
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  // Add SaveChatModal component before the return statement
  const SaveChatModal = ({ isVisible, onClose }) => {
    const [title, setTitle] = useState('');
    const modalAnimation = useSharedValue(0);

    useEffect(() => {
      modalAnimation.value = withSpring(isVisible ? 1 : 0);
    }, [isVisible]);

    const modalStyle = useAnimatedStyle(() => {
      return {
        opacity: modalAnimation.value,
        transform: [
          {
            translateY: interpolate(
              modalAnimation.value,
              [0, 1],
              [100, 0]
            )
          }
        ]
      };
    });

    const overlayStyle = useAnimatedStyle(() => {
      return {
        opacity: modalAnimation.value * 0.5,
      };
    });

    return (
      <Modal
        transparent
        visible={isVisible}
        onRequestClose={onClose}
        animationType="none"
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalOverlay, overlayStyle]}>
            <Pressable style={{ flex: 1 }} onPress={onClose} />
          </Animated.View>
          
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Save chat</Text>
            <Text style={styles.modalSubtitle}>Give your chat a title to find it later</Text>
            
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter chat title"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.saveChatInput}
            />

            <TouchableOpacity 
              style={[styles.saveChatButton, !title.trim() && styles.saveChatButtonDisabled]}
              onPress={() => {
                if (title.trim()) {
                  // Save chat logic will go here
                  onClose();
                }
              }}
              disabled={!title.trim()}
            >
              <Text style={styles.saveChatButtonText}>Save Chat</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };
  // Save Chat Modal End


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
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.menuButton, isMenuExpanded && styles.menuButtonActive]}
              onPress={toggleMenu}
            >
              <Image
                source={require('../../../assets/icons/ai-more.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            
            {isMenuExpanded && (
              <Animated.View style={[styles.expandedMenu]}>
                <Animated.View style={[styles.menuOption, firstIconStyle]}>
                  <TouchableOpacity
                    style={styles.menuOptionButton}
                    onPress={() => {
                      thirdIconAnimation.value = withDelay(0, withSpring(0));
                      secondIconAnimation.value = withDelay(50, withSpring(0));
                      firstIconAnimation.value = withDelay(100, withSpring(0));
                      setPlan([welcomeMessage]);
                      setIsMenuExpanded(false);
                    }}
                  >
                    <Image
                      source={require('../../../assets/icons/broom.png')}
                      style={styles.menuOptionIcon}
                    />
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.menuOption, secondIconStyle]}>
                  <TouchableOpacity
                    style={styles.menuOptionButton}
                    onPress={() => {
                      thirdIconAnimation.value = withDelay(0, withSpring(0));
                      secondIconAnimation.value = withDelay(50, withSpring(0));
                      firstIconAnimation.value = withDelay(100, withSpring(0));
                      // New chat functionality will go here
                      setIsMenuExpanded(false);
                    }}
                  >
                    <Image
                      source={require('../../../assets/icons/new-chat.png')}
                      style={styles.menuOptionIcon}
                    />
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.menuOption, thirdIconStyle]}>
                  <TouchableOpacity
                    style={styles.menuOptionButton}
                    onPress={() => {
                      thirdIconAnimation.value = withDelay(0, withSpring(0));
                      secondIconAnimation.value = withDelay(50, withSpring(0));
                      firstIconAnimation.value = withDelay(100, withSpring(0));
                      setIsMenuExpanded(false);
                      setIsSaveModalVisible(true);
                    }}
                  >
                    <Image
                      source={require('../../../assets/icons/save-chat.png')}
                      style={styles.menuOptionIcon}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            )}
          </View>

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

      <SaveChatModal 
        isVisible={isSaveModalVisible}
        onClose={() => setIsSaveModalVisible(false)}
      />
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
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuButtonActive: {
    borderRadius: 14,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  expandedMenu: {
    position: 'absolute',
    bottom: 40,
    left: -5,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1000,
  },
  menuOption: {
    width: 40,
    height: 40,
    marginHorizontal: 4,
  },
  menuOptionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptionIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
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

  // Save Chat Modal Start
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalContent: {
    backgroundColor: '#003300',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    boxShadow: '0 0 24px rgba(0, 0, 0, 0.45)',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  saveChatInput: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  saveChatButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveChatButtonDisabled: { 
    opacity: 0.5,
  },
  saveChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Save Chat Modal End
});

export default PlanScreen;
