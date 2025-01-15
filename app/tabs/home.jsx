import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`http://192.168.1.216:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigateToSteps = () => {
    router.push('/stepCounter'); // Ensure you're pointing to the correct route in tabs
  };

  const navigateToPlan = () => {
    router.push('/foodScreen'); // Ensure you're pointing to the correct route in tabs
  };

  const navigateToHeadspace = () => {
    router.push('/headSpace'); // Ensure you're pointing to the correct route in tabs
  };

  const navigateToExercises = () => {
    router.push('/exercises'); // Ensure you're pointing to the correct route in tabs
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6`}>
      <Text style={tw`text-3xl font-bold mb-2`}>Welcome, {userData.firstName} {userData.lastName}</Text>
      <Text style={tw`text-lg mb-8`}>Your Fitness Journey starts here!</Text>
      <TouchableOpacity onPress={navigateToSteps} style={styles.planButton}>
        <Text style={styles.planText}>Go to Step Counter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToPlan} style={styles.planButton}>
        <Text style={styles.planText}>Go to Food Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToHeadspace} style={styles.planButton}>
        <Text style={styles.planText}>Go to Headspace</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToExercises} style={styles.planButton}>
        <Text style={styles.planText}>Go to Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, tw`mt-4`]}>
        <Text style={tw`text-white text-center`}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  planButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  planText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
