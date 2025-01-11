import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { useRouter, useLocalSearchParams } from 'expo-router';  // Use useLocalSearchParams
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeightPicker = () => {
  const router = useRouter();
  const { weight: initialWeight, unit: initialUnit } = useLocalSearchParams();  // Get weight and unit from params
  const [weight, setWeight] = useState(parseFloat(initialWeight) || 70);
  const [unit, setUnit] = useState(initialUnit || 'kg');

  const handleUnitSwitch = () => {
    setUnit((prevUnit) => (prevUnit === 'lbs' ? 'kg' : 'lbs'));
  };

  const handleWeightSelect = async (selectedWeight) => {
    // Save the updated weight and unit in AsyncStorage
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      parsedUser.weight = selectedWeight;
      parsedUser.unit = unit;
      await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
    }
    router.back();  // Go back to the previous screen
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`} onPress={() => router.back()}>
        <Text style={tw`text-blue-500`}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`absolute top-5 right-5`} onPress={handleUnitSwitch}>
        <Text style={tw`text-blue-500`}>{`Switch to ${unit === 'lbs' ? 'kg' : 'lbs'}`}</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8 text-center`}>Select your weight</Text>
      <View style={tw`items-center`}>
        {Array.from({ length: 10 }, (_, i) => {
          const displayWeight = unit === 'lbs' ? (weight + i * 0.1).toFixed(1) : ((weight + i * 0.1) / 2.205).toFixed(1);
          return (
            <TouchableOpacity
              key={i}
              style={[styles.weightCard, tw`w-full items-center mb-4`]}
              onPress={() => handleWeightSelect(displayWeight)}
            >
              <Text style={tw`text-lg`}>{`${displayWeight} ${unit}`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weightCard: {
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

export default WeightPicker;
