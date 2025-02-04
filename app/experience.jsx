import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LiftingExperience = () => {
  const router = useRouter();

  const handleExperienceSelection = async (experience) => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');
    if (user) {
      try {
        const response = await axios.patch(`http://localhost:5000/user/${user._id}/experience`, { experience }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Experience updated:', response.data);
        router.push('/avatar');// Navigate to the weight input page
      } catch (error) {
        console.error('Error updating experience:', error);
        alert('Failed to update experience. Please try again.');
      }
    } else {
      console.error('No user is signed in');
      alert('No user is signed in');
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`} onPress={() => router.push('/Home')}>
        <Text style={tw`text-blue-500`}>Cancel</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8`}>How much lifting experience do you have?</Text>
      <View style={tw`mb-6`}>
        {[
          { label: 'Beginner', description: '<6 months', icon: 'leaf', color: '#00FF00' },
          { label: 'Intermediate', description: '6+ months', icon: 'seedling', color: '#00FF7F' },
          { label: 'Advanced', description: '1.5+ years', icon: 'tree', color: '#FFD700' },
          { label: 'Pro', description: '4+ years', icon: 'mountain', color: '#FF8C00' },
          { label: 'Elite', description: '8+ years', icon: 'sun', color: '#FF4500' }
        ].map((exp, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.experienceCard, tw`flex-row items-center mb-4`]}
            onPress={() => handleExperienceSelection(exp.label)}
          >
            <Icon name={exp.icon} size={32} color={exp.color} />
            <View style={tw`ml-4`}>
              <Text style={tw`text-lg font-bold`}>{exp.label}</Text>
              <Text style={tw`text-gray-500`}>{exp.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
