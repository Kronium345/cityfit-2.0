import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const Home = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselData = [
    {
      title: 'Calories',
      value: '3,350',
      subtitle: 'Remaining = Goal - Food + Exercise',
      details: [
        { label: 'Base Goal', value: '3,350' },
        { label: 'Food', value: '0' },
        { label: 'Exercise', value: '0' },
      ]
    },
    {
      title: 'Macros',
      value: '180g',
      subtitle: 'Protein Goal',
      details: [
        { label: 'Carbs', value: '420g' },
        { label: 'Protein', value: '180g' },
        { label: 'Fat', value: '74g' },
      ]
    },
    {
      title: 'Water',
      value: '0',
      subtitle: 'Glasses',
      details: [
        { label: 'Goal', value: '8' },
        { label: 'Current', value: '0' },
        { label: 'Remaining', value: '8' },
      ]
    },
    {
      title: 'Weight',
      value: '0.0',
      subtitle: 'kg',
      details: [
        { label: 'Start', value: '0.0' },
        { label: 'Current', value: '0.0' },
        { label: 'Goal', value: '0.0' },
      ]
    },
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={tw`bg-white rounded-xl p-6 shadow-md`}>
      <Text style={tw`text-xl font-bold mb-2`}>{item.title}</Text>
      <Text style={tw`text-sm text-gray-500 mb-4`}>{item.subtitle}</Text>

      <View style={tw`items-center mb-4`}>
        <View style={tw`w-32 h-32 rounded-full border-4 border-blue-500 items-center justify-center`}>
          <Text style={tw`text-2xl font-bold`}>{item.value}</Text>
          <Text style={tw`text-sm text-gray-500`}>{item.title}</Text>
        </View>
      </View>

      <View style={tw`flex-row justify-between`}>
        {item.details.map((detail, index) => (
          <View key={index}>
            <Text style={tw`text-gray-500`}>{detail.label}</Text>
            <Text style={tw`font-bold`}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user._id}`, {
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
    router.push('/stepCounter'); // Ensure correct route in tabs
  };

  const navigateToPlan = () => {
    router.push('/foodScreen'); // Ensure correct route in tabs
  };

  const navigateToHeadspace = () => {
    router.push('/mental'); // Ensure correct route in tabs
  };

  const navigateToExercises = () => {
    router.push('/exercises'); // Ensure correct route in tabs
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Welcome, {userData.firstName} {userData.lastName}</Text>
      <Text style={styles.headerSubtitle}>Your Fitness Journey starts here!</Text>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={carouselData}
          renderItem={renderCarouselItem}
          sliderWidth={width - 48}
          itemWidth={width - 48}
          onSnapToItem={setActiveSlide}
          useScrollView={true}
        />
        <View style={styles.paginationContainer}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeSlide === index ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      </View>

      {/* Steps Card */}
      <TouchableOpacity onPress={navigateToSteps} style={styles.card}>
        <Text style={styles.cardTitle}>Steps</Text>
        <View style={styles.cardRow}>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>0</Text>
            <Text style={styles.labelText}>steps</Text>
          </View>
          <Text style={styles.labelText}>Goal: 10,000 steps</Text>
        </View>
      </TouchableOpacity>

      {/* Exercise Card */}
      <TouchableOpacity onPress={navigateToExercises} style={styles.card}>
        <Text style={styles.cardTitle}>Exercise</Text>
        <View style={styles.cardRow}>
          <View style={styles.valueContainer}>
            <Text>🔥</Text>
            <Text style={styles.labelText}>0 cal</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text>⏱️</Text>
            <Text style={styles.labelText}>00:00 hr</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  contentContainer: {
    padding: 24, // p-6
  },

  // Header Styles
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },

  // Carousel Styles
  carouselContainer: {
    marginBottom: 16,
  },
  carouselCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#6b7280', // text-gray-500
    marginBottom: 16,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  circle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#3b82f6', // border-blue-500
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  circleLabel: {
    fontSize: 14,
    color: '#6b7280', // text-gray-500
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#6b7280', // text-gray-500
  },
  detailValue: {
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3b82f6', // bg-blue-500
  },
  inactiveDot: {
    backgroundColor: '#d1d5db', // bg-gray-300
  },

  // Card Styles (Steps & Exercise)
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  labelText: {
    color: '#6b7280', // text-gray-500
  },

  // Logout Button
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Home;
