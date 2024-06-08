import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      // Navigate to the home screen
      router.push('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      showToast('error', 'Invalid Credentials', 'Invalid credentials. Please try again');
    }
  };

  return (
    <>
      <View style={tw`flex-1 bg-gray-100 p-6`}>
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>Later</Text>
          </TouchableOpacity>
        </View>
        <Text style={tw`text-3xl font-bold mb-2`}>Log in</Text>
        <Text style={tw`text-lg mb-8`}>Log in to access your account.</Text>
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
            <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={tw`bg-blue-500 p-4 rounded-md flex-row justify-center items-center mb-4`} onPress={handleLogin}>
          <Icon name="sign-in" size={20} color="#FFF" style={tw`mr-2`} />
          <Text style={tw`text-white text-lg`}>Log in</Text>
        </TouchableOpacity>
        <Text style={tw`text-center text-gray-500 mt-6`}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/Signup')}>
          <Text style={tw`text-blue-500 text-center`}>Sign up</Text>
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
      </View>
      <Toast />
    </>
  );
};

export default Login;

const styles = StyleSheet.create({});
