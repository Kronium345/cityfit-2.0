import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeightInput = () => {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const navigation = useNavigation();
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setWeight(parsedUser.weight || '');
        setUnit(parsedUser.unit || 'kg');
      }
    };

    fetchUserData();
  }, []);

  const handleWeightPress = () => {
    navigation.navigate('weightPicker', { weight, unit, setWeight });
  };

  const handleDone = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      parsedUser.weight = weight;
      parsedUser.unit = unit;
      await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
      router.push('/tabs/home');
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'kg' ? 'lbs' : 'kg'));
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`} onPress={() => router.push('/tabs/home')}>
        <Text style={tw`text-blue-500`}>Back</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8`}>How much do you weigh?</Text>
      <View style={[styles.inputContainer, tw`mb-6`]}>
        <TouchableOpacity onPress={handleWeightPress}>
          <Text style={tw`text-lg`}>Weight</Text>
          <Text style={tw`text-lg`}>{weight} {unit}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.inputContainer, tw`mb-6`]}>
        <Text style={tw`text-lg`}>Import</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`flex-1`}>Health Connect</Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>Toggle</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={toggleUnit}>
        <Text style={tw`text-blue-500 text-center`}>Switch to {unit === 'kg' ? 'lbs' : 'kg'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDone} style={[tw`w-full py-4 rounded-full mt-6`, { backgroundColor: '#ADD8E6' }]}>
        <Text style={tw`text-white text-center text-lg`}>Done</Text>
      </TouchableOpacity>
      <Text style={tw`text-center text-gray-500 mt-6`}>
        By continuing, you agree to our <Text style={tw`text-blue-500`}>terms of service</Text> and <Text style={tw`text-blue-500`}>privacy policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});

export default WeightInput;
