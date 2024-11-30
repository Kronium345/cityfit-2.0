import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Button, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useAuthContext } from '../app/AuthProvider';
import NewSetInput from '../components/NewSetInput';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

const ExerciseDetail = () => {
  const route = useRoute();
  const { user } = useAuthContext();
  const exerciseId = parseInt(route.params?.id, 10);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const handleLogExercise = async (sets, reps, weight) => {
    if (!user || isNaN(exerciseId)) {
      showToast('error', 'Exercise Logging Failed', 'User not logged in or ExerciseId is invalid');
      return;
    }

    console.log(exerciseId);

    const logEntry = {
      userId: user._id,
      exerciseId,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };

    try {
      const response = await axios.post(`http://192.168.1.45:5000/history/history`, logEntry);
      console.log('Exercise logged:', response.data);
      showToast('success', 'Exercise Logged Successfully', 'Your exercise has been logged.');
    } catch (error) {
      console.error('Error logging exercise:', error.response ? error.response.data : error.message);
      showToast('error', 'Exercise Logging Failed', 'Error occurred while logging exercise.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{route.params?.name || 'Exercise Details'}</Text>
      <Image source={{ uri: route.params?.image }} style={styles.image} />
      <Text style={styles.description}>{route.params?.description || 'No description available.'}</Text>
      <NewSetInput onLogExercise={handleLogExercise} />
      <Toast ref={(ref) => Toast.setRef(ref)} />  {/* Ensure Toast is set up at the root level of your component tree */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: screenWidth - 40, // subtracting padding for actual width
    height: (screenWidth - 40) * 0.5625, // maintaining a 16:9 aspect ratio
    resizeMode: 'contain', // This will ensure the entire image is visible, might add letterboxing
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default ExerciseDetail;
