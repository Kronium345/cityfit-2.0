import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'expo-router';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShow(Platform.OS === 'ios');
    setDob(currentDate);
  };

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);
      // Navigate to the gender screen
      router.push('/gender');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.message);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 p-6`}>
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <TouchableOpacity>
          <Text style={tw`text-blue-500`}>Later</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`text-3xl font-bold mb-2`}>Create account</Text>
      <Text style={tw`text-lg mb-8`}>Create an account to keep your workout data safe.</Text>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="user" size={20} color="#000" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1`}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="user" size={20} color="#000" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="envelope" size={20} color="#000" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="lock" size={20} color="#000" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1`}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="lock" size={20} color="#000" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1`}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row items-center mb-4 bg-white border border-gray-300 rounded-md p-3`}>
        <Icon name="calendar" size={20} color="#000" style={tw`mr-2`} />
        <TouchableOpacity onPress={() => setShow(true)} style={tw`flex-1`}>
          <Text>{dob.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <TouchableOpacity style={tw`bg-blue-500 p-4 rounded-md flex-row justify-center items-center mb-4`} onPress={handleSignUp}>
        <Icon name="user-plus" size={20} color="#FFF" style={tw`mr-2`} />
        <Text style={tw`text-white text-lg`}>Sign up</Text>
      </TouchableOpacity>
      <Text style={tw`text-center text-gray-500 mt-6`}>
        By continuing, you agree to our <Text style={tw`text-blue-500`}>terms of service</Text> and <Text style={tw`text-blue-500`}>privacy policy</Text>.
      </Text>
      <Text style={tw`text-center text-gray-500 mt-6`}>
        Already have an account?
      </Text>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={tw`text-blue-500 text-center`}>Log in</Text>
      </TouchableOpacity>
      <Text style={tw`text-center text-gray-500 my-4`}>Or</Text>
      <View style={tw`flex-row justify-center mb-6`}>
        <TouchableOpacity style={tw`mx-2 bg-white p-2 rounded-full`}>
          <Icon name="google" size={36} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-2 bg-white p-2 rounded-full`}>
          <Icon name="apple" size={36} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-2 bg-white p-2 rounded-full`}>
          <Icon name="facebook" size={36} color="#3B5998" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
