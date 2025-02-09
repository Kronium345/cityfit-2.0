import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker'; // Native version
import DatePicker from 'react-datepicker'; // Web version
import 'react-datepicker/dist/react-datepicker.css'; // For Web
import tw from 'twrnc';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

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
      showToast('error', 'Age Restriction', 'You must be 18 or older to sign up');
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
      showToast('error', 'Age Restriction', 'You must be 18 or older to sign up');
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
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
        </View>

        {/* Name Fields Start */}
        <View style={styles.nameFieldsRow}>
          <View style={styles.nameFieldContainer}>
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>First Name</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>
          <View style={styles.nameFieldContainer}>
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Last Name</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>
        {/* Name Fields End */}

        {/* Email Field Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        {/* Email Field End */}

        {/* Username Field Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        {/* Username Field End */}

        {/* Date of Birth Field Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.required}>*</Text>
          </View>
          {Platform.OS === 'web' ? (
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="yyyy/MM/dd"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
            />
          ) : (
            <>
              <TouchableOpacity 
                style={styles.dobButton}
                onPress={() => setShow(true)}
              >
                <Text style={styles.dobButtonText}>{dob.toLocaleDateString()}</Text>
                <Icon name="calendar" size={20} color="rgba(255, 255, 255, 0.45)" />
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
        {/* Date of Birth Field End */}

        {/* Password Field Start */}
        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password (minimum 6 characters)"
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

        <View style={styles.inputSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm password"
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="rgba(255, 255, 255, 0.45)" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Password Field End */}

        {/* Terms and Conditions Checkbox Start */}
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Icon name="check" size={12} color="#000" style={styles.checkIcon} />}
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the <Text style={styles.termsLink}>terms & conditions</Text> and the{' '}
            <Text style={styles.termsLink}>privacy policy</Text>
          </Text>
        </View>
        {/* Terms and Conditions Checkbox End */}

        {/* Sign Up Button Start */}
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
        {/* Sign Up Button End */}

        {/* Divider Start */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        {/* Divider End */}

        {/* Integrations Buttons Start */}
        <TouchableOpacity style={styles.integrationButton}>
          <Icon name="apple" size={20} color="#FFFFFF" style={styles.integrationIcon}/>
          <Text style={styles.integrationButtonText}>Sign up with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.integrationButton, styles.latterIntegrationButton]}>
          <Image 
            source={require('../assets/images/logo-img/logo-google.png')}
            style={styles.integrationIcon}
          />
          <Text style={styles.integrationButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
        {/* Integrations Buttons End */}

        {/* Login Prompt Start */}
        <View style={styles.loginPromptContainer}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
        {/* Login Prompt End */}

      </ScrollView>
    </LinearGradient>

  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
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

  // Fields Container Start
  nameFieldsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  nameFieldContainer: {
    flex: 1,
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    marginBottom: 16,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
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
  dobContainer: {
    marginBottom: 16,
  },
  dobLabel: {
    color: 'white',
    marginBottom: 8,
  },
  dobButton: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dobButtonText: {
    color: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
  // Fields Container End

  // Terms and Conditions Start
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    marginRight: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  checkIcon: {
  },
  termsText: {
    color: '#9CA3AF',
    fontSize: 14,
    flex: 1,
    textShadow: '0 0 6px rgba(0, 0, 0, 0.35)',
  },
  termsLink: {
    color: '#FFF',
  },
  // Terms and Conditions End

  // Sign Up Button Start
  signUpButton: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  signUpButtonInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  signUpButtonText: {
    color: '#000000',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.3)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Sign Up Button End

  // Divider Start
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 16,
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

  // Integrations Start
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
  latterIntegrationButton: {
    marginBottom: 24,
  },
  // Integrations End

  // Login Prompt Start
  loginPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    color: '#9CA3AF',
    textShadow: '0 0 6px rgba(0, 0, 0, 0.35)',
  },
  loginLink: {
    color: '#FFFFFF',
  },
  // Login Prompt End
});