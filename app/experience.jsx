import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { FaLeaf, FaSeedling, FaTree, FaMountain, FaSun } from 'react-icons/fa';

const LiftingExperience = () => {
  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`}>
        <Text style={tw`text-blue-500`}>Back</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8`}>How much lifting experience do you have?</Text>
      <View style={tw`mb-6`}>
        <TouchableOpacity style={[styles.experienceCard, tw`flex-row items-center mb-4`]}>
          <FaLeaf size={32} color="#00FF00" />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold`}>Beginner</Text>
            <Text style={tw`text-gray-500`}>{'<6 months'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.experienceCard, tw`flex-row items-center mb-4`]}>
          <FaSeedling size={32} color="#00FF7F" />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold`}>Intermediate</Text>
            <Text style={tw`text-gray-500`}>{'6+ months'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.experienceCard, tw`flex-row items-center mb-4`]}>
          <FaTree size={32} color="#FFD700" />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold`}>Advanced</Text>
            <Text style={tw`text-gray-500`}>{'1.5+ years'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.experienceCard, tw`flex-row items-center mb-4`]}>
          <FaMountain size={32} color="#FF8C00" />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold`}>Pro</Text>
            <Text style={tw`text-gray-500`}>{'4+ years'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.experienceCard, tw`flex-row items-center mb-4`]}>
          <FaSun size={32} color="#FF4500" />
          <View style={tw`ml-4`}>
            <Text style={tw`text-lg font-bold`}>Elite</Text>
            <Text style={tw`text-gray-500`}>{'8+ years'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={tw`mt-6`}>
        <Text style={tw`text-blue-500 text-center`}>Help</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  experienceCard: {
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

export default LiftingExperience;
