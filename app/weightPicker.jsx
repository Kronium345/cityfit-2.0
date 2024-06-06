import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';

const WeightPicker = () => {
  const [unit, setUnit] = useState('lbs');
  const [weight, setWeight] = useState(185);

  const handleUnitSwitch = () => {
    setUnit(prevUnit => (prevUnit === 'lbs' ? 'kg' : 'lbs'));
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`}>
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
            <TouchableOpacity key={i} style={[styles.weightCard, tw`w-full items-center mb-4`]}>
              <Text style={tw`text-lg`}>{`${displayWeight} ${unit}`}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={tw`flex-1 justify-end mb-10`}>
        <View style={tw`flex-row justify-around`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '✓'].map((num, idx) => (
            <TouchableOpacity key={idx} style={styles.numberKey}>
              <Text style={tw`text-2xl`}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

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
  numberKey: {
    width: '22%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});

export default WeightPicker;
