import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Image, Dimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useAuthContext } from '../app/AuthProvider';
import NewSetInput from '../components/NewSetInput';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

const ExerciseDetail = () => {
  // Use useLocalSearchParams to access route parameters
  const { id, name, description, image, equipment, exerciseType, majorMuscle, minorMuscle, modifications } = useLocalSearchParams();
  const { user } = useAuthContext();

  // Ensure the id exists before proceeding
  if (!id) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Exercise details unavailable</Text>
      </ScrollView>
    );
  }

  // ExerciseId is passed through the URL from the exercises.jsx component
  const exerciseId = id;

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
    if (!user || !name) {  // Use name from localSearchParams instead of exerciseId
      showToast('error', 'Exercise Logging Failed', 'User not logged in or Exercise name is invalid');
      return;
    }
  
    const logEntry = {
      userId: user._id,
      exerciseName: name,  // Pass exercise name instead of exerciseId
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };
  
    try {
      const response = await axios.post(`http://localhost:5000/history/history`, logEntry);
      console.log('Exercise logged:', response.data);
      showToast('success', 'Exercise Logged Successfully', 'Your exercise has been logged.');
    } catch (error) {
      console.error('Error logging exercise:', error.response ? error.response.data : error.message);
      showToast('error', 'Exercise Logging Failed', 'Error occurred while logging exercise.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{name || 'Exercise Details'}</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.description}>{description || 'No description available.'}</Text>

      {/* Display Exercise Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Exercise Details</Text>
        <Text>Equipment: {equipment || 'Not specified'}</Text>
        <Text>Exercise Type: {exerciseType || 'Not specified'}</Text>
        <Text>Major Muscle: {majorMuscle || 'Not specified'}</Text>
        <Text>Minor Muscle: {minorMuscle || 'Not specified'}</Text>
        <Text>Modifications to Help: {modifications || 'Not specified'}</Text>
      </View>

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
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ExerciseDetail;
