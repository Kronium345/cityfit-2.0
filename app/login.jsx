import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  // To accept email & username
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
    });
  };

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      showToast('error', 'Incomplete Fields', 'Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        emailOrUsername,
        password,
      });

      console.log('User logged in:', response.data);

      // Save token and user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.result));
      await AsyncStorage.setItem('token', response.data.token);

      // Navigate to the home screen
      router.push('/(drawer)/(tabs)/home');
    } catch (error) {
      console.error('Error logging in:', error);
      showToast('error', 'Invalid Credentials', 'Invalid credentials. Please try again');
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header Start */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log In</Text>
        </View>
        {/* Header End */}


        {/* Email/Username Input Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email or Username</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
          />
        </View>
        {/* Email/Username Input End */}


        {/* Password Input Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="rgba(255, 255, 255, 0.45)" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Password Input End */}


        {/* Login Button Start */}
        <TouchableOpacity 
          style={[
            styles.loginButton,
            email && password ? styles.loginButtonActive : styles.loginButtonInactive
          ]}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        {/* Login Button End */}


        {/* Forgot Password Link Start */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* Forgot Password Link End */}


        {/* Divider Start */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        {/* Divider End */}


        {/* Social Buttons Start */}
        <TouchableOpacity style={styles.integrationButton}>
          <Icon name="apple" size={20} color="#FFF" style={styles.integrationIconSpacing} />
          <Text style={styles.integrationButtonText}>Log in with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.integrationButton, styles.latterIntegrationButton]}>
          <Image 
            source={require('../assets/images/logo-img/logo-google.png')}
            style={styles.integrationIcon}
          />
          <Text style={styles.integrationButtonText}>Log in with Google</Text>
        </TouchableOpacity>
        {/* Social Buttons End */}


        {/* Sign Up Prompt Start */}
        <View style={styles.signUpPromptContainer}>
          <Text style={styles.signUpPromptText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
        {/* Sign Up Prompt End */}

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  // Header Component Start
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    position: 'relative',
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: 'rgba(0, 0, 0, 0.8)',
  },
  // Header Component End

  // Input Fields Start
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    marginBottom: 16,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
    position: 'relative',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.6,
    letterSpacing: 0.65,
  },
  required: {
    color: '#ff4444',
    marginLeft: 4,
    fontSize: 14,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 8,
    padding: 4,
    height: '100%',
    justifyContent: 'center',
  },
  // Input Fields End

  // Login Button Start
  loginButton: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loginButtonInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loginButtonText: {
    color: '#000000',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.3)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Login Button End

  // Forgot Password Start
  forgotPasswordContainer: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  // Forgot Password End

  // Divider Start
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Divider End

  // Integration Buttons Start
  integrationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  integrationButtonText: {
    color: '#FFFFFF',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.6)',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  integrationIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  integrationIconSpacing: {
    marginRight: 8,
  },
  latterIntegrationButton: {
    marginBottom: 24,
  },
  // Integration Buttons End

  // Sign Up Prompt Start
  signUpPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpPromptText: {
    color: '#9CA3AF',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.35)',
  },
  signUpLink: {
    color: '#FFFFFF',
  },
  // Sign Up Prompt End
});

export default Login;
