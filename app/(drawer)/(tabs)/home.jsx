import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import tw from 'twrnc';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
  const blob1Animation = useSharedValue(0);
  const blob2Animation = useSharedValue(0);
  const blob3Animation = useSharedValue(0);

  useEffect(() => {
    const animate = (value, duration) => {
      'worklet';
      value.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    };

    animate(blob1Animation, 15000);
    animate(blob2Animation, 25000);
    animate(blob3Animation, 20000);
  }, []);

  const createBlobStyle = (animation) => {
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { scale: 1 + animation.value * 0.2 },
        { rotate: `${animation.value * 360}deg` },
      ],
      opacity: 0.7 + animation.value * 0.2,
    }));

    return animatedStyles;
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.backgroundContainer}>
        <AnimatedSvg style={[styles.blob, createBlobStyle(blob1Animation)]}>
          <Circle r={100} cx={100} cy={100} fill="rgba(7, 94, 7, 0.4)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob2, createBlobStyle(blob2Animation)]}>
          <Circle r={110} cx={110} cy={110} fill="rgba(6, 214, 37, 0.15)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob3, createBlobStyle(blob3Animation)]}>
          <Circle r={90} cx={90} cy={90} fill="rgba(0, 0, 0, 0.4)" />
        </AnimatedSvg>
      </View>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};
// Blob Blurred Background End


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
    <BlurView intensity={20} tint="light" style={styles.carouselItem}>
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>

      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Text style={styles.circleValue}>{item.value}</Text>
          <Text style={styles.circleLabel}>{item.title}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        {item.details.map((detail, index) => (
          <View key={index}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </BlurView>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`https://fitness-one-server.onrender.com/user/${user._id}`, {
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
    <View style={styles.container}>
      <BlobBackground />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.welcomeText}>Welcome, {userData.firstName || 'User'}</Text>
        <Text style={styles.subText}>Let's check your daily stats</Text>

        {/* New Run Club Card */}
        <TouchableOpacity style={styles.promoCardContainer}>
          <BlurView intensity={20} tint="light" style={styles.promoCardBlur} />
          <View style={styles.promoContent}>
            <View>
              <Text style={styles.promoTitle}>Join the Run Club</Text>
              <Text style={styles.promoSubtitle}>Become part of our growing fitness community for totally free!</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>See More</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>

        <View style={styles.carouselContainer}>
          <Carousel
            data={carouselData}
            renderItem={renderCarouselItem}
            sliderWidth={width - 40}
            itemWidth={width - 40}
            onSnapToItem={setActiveSlide}
          />
        </View>

        {/* Steps Card */}
        <BlurView intensity={20} tint="light" style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Steps</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>0</Text>
              <Text style={styles.labelText}>steps</Text>
            </View>
          </View>
          <Text style={styles.goalText}>Goal: 10,000 steps</Text>
        </BlurView>

        {/* Exercise Card */}
        <BlurView intensity={20} tint="light" style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>Exercise</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>0</Text>
              <Text style={styles.labelText}>cal</Text>
            </View>
          </View>
          <Text style={styles.goalText}>Duration: 0:00 hr</Text>
        </BlurView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 0, 1)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  // Blob Blurred Background Start
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: '10%',
    top: '20%',
  },
  blob2: {
    left: '60%',
    top: '45%',
  },
  blob3: {
    left: '30%',
    top: '70%',
  },
  // Blob Blurred Background End

  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  labelText: {
    color: '#fff',
    opacity: 0.7,
  },
  goalText: {
    color: '#fff',
    opacity: 0.7,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Carousel specific styles
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
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
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circleValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  circleLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#fff',
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#fff',
  },
  promoCardContainer: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  promoCardBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  promoContent: {
    padding: 24,
    zIndex: 1,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 22,
  },
  promoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Home;
