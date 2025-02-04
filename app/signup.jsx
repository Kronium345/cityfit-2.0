import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
    
    const currentDate = selectedDate || dob;
    setShow(Platform.OS === 'ios');
    setDob(currentDate);

    // Show toast if user is under 18
    if (!isUserOver18(currentDate)) {
      showToast(
        'error',
        'Age Restriction',
        'You must be 18 or older to sign up'
      );
    }
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
    });
  };

    // Function to calculate age and check if the user is 18 or older
    const isUserOver18 = (dob) => {
      const currentDate = new Date();
      const age = currentDate.getFullYear() - dob.getFullYear();
      const month = currentDate.getMonth() - dob.getMonth();
      
      // If the current month is before the birth month, subtract 1 from age
      if (month < 0 || (month === 0 && currentDate.getDate() < dob.getDate())) {
        return age - 1 >= 18; // Check if the user is at least 18 years old
      }
  
      return age >= 18; // User is 18 or older
    };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showToast('error', 'Incomplete Fields', 'Please fill in all required fields');
      return;
    }
    if (!acceptedTerms) {
      showToast('error', 'Terms & Conditions', 'Please accept the terms and conditions');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Password Mismatch', 'Passwords do not match');
      return;
    }
    if (!isUserOver18(dob)) {
      showToast('error', 'Age Restriction', 'You must be 18 or older to sign up');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        firstName,
        lastName,
        email,
        password,
        dob,
        username: username || undefined,
      });

      const { result, token } = response.data;

      // Store the user and token in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(result));
      await AsyncStorage.setItem('token', token);

      console.log('User registered:', result);

      // Navigate to the next screen
      router.push('/gender');
    } catch (error) {
      console.error('Error signing up:', error);
      showToast('error', 'Error Signing Up', error.message);
    }
  };

  // Add this validation function
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidAge = isUserOver18(dob);
    
    if (!isValidAge) {
      showToast(
        'error',
        'Age Restriction',
        'You must be 18 or older to sign up'
      );
    }

    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      emailRegex.test(email) &&
      password.length >= 6 &&
      password === confirmPassword &&
      acceptedTerms &&
      isValidAge
    );
  };

  return (
    <ScrollView style={tw`flex-1 bg-black p-6`}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign up</Text>
      </View>

      {/* Name Fields Row */}
      <View style={tw`flex-row gap-4 mb-4`}>
        <View style={tw`flex-1`}>
          <TextInput
            style={tw`bg-gray-800 text-white p-4 rounded-md`}
            placeholder="First name"
            placeholderTextColor="#666"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={tw`flex-1`}>
          <TextInput
            style={tw`bg-gray-800 text-white p-4 rounded-md`}
            placeholder="Last name"
            placeholderTextColor="#666"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      <TextInput
        style={tw`bg-gray-800 text-white p-4 rounded-md mb-4`}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={tw`bg-gray-800 text-white p-4 rounded-md mb-4`}
        placeholder="Username (optional)"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
      />

      <View style={tw`mb-4`}>
        <Text style={tw`text-white mb-2`}>Date of Birth</Text>
        {Platform.OS === 'ios' ? (
          <View style={tw`bg-gray-800 rounded-md overflow-hidden`}>
            <DateTimePicker
              style={tw`h-12 w-full`}
              value={dob}
              mode="date"
              display="spinner"
              onChange={onChange}
              maximumDate={new Date()}
              textColor="white"
            />
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={tw`bg-gray-800 p-4 rounded-md flex-row justify-between items-center`}
              onPress={() => setShow(true)}
            >
              <Text style={tw`text-white`}>
                {dob.toLocaleDateString()}
              </Text>
              <Icon name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}
          </>
        )}
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`bg-gray-800 text-white p-4 rounded-md`}
          placeholder="Password (minimum 6 characters)"
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

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`bg-gray-800 text-white p-4 rounded-md`}
          placeholder="Confirm password"
          placeholderTextColor="#666"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity 
          style={tw`absolute right-4 top-4`}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Terms and Conditions Checkbox */}
      <View style={tw`flex-row items-start mb-6`}>
        <TouchableOpacity 
          style={tw`mr-2 mt-1`}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[
            tw`w-4 h-4 border border-gray-700 rounded-sm`,
            acceptedTerms && tw`bg-blue-500 border-blue-500`
          ]}>
            {acceptedTerms && <Icon name="check" size={12} color="#FFF" style={tw`m-auto`} />}
          </View>
        </TouchableOpacity>
        <Text style={tw`text-gray-400 text-sm flex-1`}>
          I accept the <Text style={tw`text-blue-500`}>terms & conditions</Text> and the{' '}
          <Text style={tw`text-blue-500`}>privacy policy</Text>
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.signUpButton,
          isFormValid() ? styles.signUpButtonActive : styles.signUpButtonInactive
        ]}
        onPress={handleSignUp}
        disabled={!isFormValid()}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Updated Social Sign Up Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="apple" size={20} color="#FFF" style={tw`mr-2`} />
        <Text style={styles.socialButtonText}>Sign up with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, tw`mb-6`]}>
        <Image 
          source={require('../assets/images/logo-img/logo-google.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      <View style={tw`flex-row justify-center items-center`}>
        <Text style={tw`text-gray-400`}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={tw`text-blue-500`}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
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
  signUpButton: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonActive: {
    backgroundColor: '#3B82F6',
  },
  signUpButtonInactive: {
    backgroundColor: '#9CA3AF',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
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
});
