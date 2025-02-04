import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
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
    if (!email || !password) {
      showToast('error', 'Incomplete Fields', 'Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
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
    <ScrollView style={tw`flex-1 bg-black p-6`}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Log in</Text>
      </View>

      {/* Email Input */}
      <TextInput
        style={tw`bg-gray-800 text-white p-4 rounded-md mb-4`}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <View style={tw`mb-4`}>
        <TextInput
          style={tw`bg-gray-800 text-white p-4 rounded-md`}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          style={tw`absolute right-4 top-4`}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        style={[
          styles.loginButton,
          email && password ? styles.loginButtonActive : styles.loginButtonInactive
        ]}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Or Divider using StyleSheet */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="apple" size={20} color="#FFF" style={tw`mr-2`} />
        <Text style={styles.socialButtonText}>Log in with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, tw`mb-6`]}>
        <Image 
          source={require('../assets/images/logo-img/logo-google.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Log in with Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={tw`flex-row justify-center items-center`}>
        <Text style={tw`text-gray-400`}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={tw`text-blue-500`}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  socialButton: {
    backgroundColor: '#1c1c1e',
    borderColor: '#2c2c2e',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  loginButton: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#3B82F6',
  },
  loginButtonInactive: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1f2937',
  },
  dividerText: {
    color: '#6b7280',
    paddingHorizontal: 12,
  },
  forgotPasswordContainer: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Login;
