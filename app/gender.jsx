import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenderSelection = () => {
  const router = useRouter();

  const handleGenderSelection = async (gender) => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');
    if (user) {
      try {
        const response = await axios.patch(`http://192.168.1.212:5000/user/${user._id}/gender`, { gender }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Gender updated:', response.data);
        router.push('/experience'); // Navigate to the experience page
      } catch (error) {
        console.error('Error updating gender:', error);
        alert('Failed to update gender. Please try again.');
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
      <Text style={tw`text-2xl font-bold mb-8 text-center`}>Please select your gender</Text>
      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity 
          style={[styles.genderCard, tw`flex-1 items-center justify-center mx-2`]}
          onPress={() => handleGenderSelection('Male')}
        >
          <Icon name="mars" size={48} color="#00BFFF" />
          <Text style={tw`text-lg font-bold mt-2`}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.genderCard, tw`flex-1 items-center justify-center mx-2`]}
          onPress={() => handleGenderSelection('Female')}
        >
          <Icon name="venus" size={48} color="#FF6347" />
          <Text style={tw`text-lg font-bold mt-2`}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={tw`mt-2`}>
        <Text style={tw`text-blue-500 text-center`}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`absolute bottom-10 self-center`}>
        <Text style={tw`text-gray-500`}>Do you have an account? <Text style={tw`text-blue-500`}>Log in.</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  genderCard: {
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

export default GenderSelection;
