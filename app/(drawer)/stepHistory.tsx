import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
  const blob1Animation = useSharedValue(0);
  const blob2Animation = useSharedValue(0);
  const blob3Animation = useSharedValue(0);

  useEffect(() => {
    const animate = (value: any, duration: number) => {
      'worklet';
      value.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    };

    animate(blob1Animation, 8000);
    animate(blob2Animation, 12000);
    animate(blob3Animation, 10000);
  }, []);

  const createBlobStyle = (animation: any) => {
    'worklet';
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { translateX: animation.value * 40 - 20 },
        { translateY: animation.value * 40 - 20 }
      ]
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


// Function to get month name
const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

// Function to format date as "Month, DD"
const formatDate = (date: Date): string => {
  const month = getMonthName(date.getMonth());
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}, ${day}`;
};

// Function to determine if a date is today
const isToday = (dateStr: string): boolean => {
  const today = formatDate(new Date());
  return dateStr === today;
};

// Function to process history data and determine status
const processHistoryData = (rawData: any[]) => {
  const today = formatDate(new Date());

  return rawData.map(entry => ({
    ...entry,
    current: entry.date === today,
    completed: entry.steps > 0
  }));
};

const StepHistory = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Streaks');

  // Raw history data (simulating database records)
  const rawHistoryData = useMemo(() => {
    const today = formatDate(new Date());

    return [
      { date: today, steps: 69 }, // Today's date
      { date: 'February, 07', steps: 11484 },
      { date: 'February, 06', steps: 319 },
      { date: 'February, 05', steps: 9705 },
      { date: 'February, 04', steps: 8240 },
      { date: 'February, 03', steps: 4336 },
      { date: 'February, 02', steps: 0 },
      { date: 'February, 01', steps: 925 },
      { date: 'January, 31', steps: 0 },
      { date: 'January, 30', steps: 0 },
      { date: 'January, 29', steps: 0 },
      { date: 'January, 28', steps: 0 },
    ];
  }, []);


  // Process the history data
  const historyData = useMemo(() => {
    return processHistoryData(rawHistoryData);
  }, [rawHistoryData]);

  return (
    <View style={styles.container}>
      <BlobBackground />
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Fixed Content */}
      <View style={styles.fixedContent}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Streaks' && styles.activeTab]}
            onPress={() => setActiveTab('Streaks')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Streaks' && styles.activeTabText
            ]}>
              Streaks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Awards' && styles.activeTab]}
            onPress={() => setActiveTab('Awards')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Awards' && styles.activeTabText
            ]}>
              Awards
            </Text>
          </TouchableOpacity>
        </View>

        {/* Streak Stats */}
        <View style={styles.streakStatsContainer}>
          <View style={styles.streakBox}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.streakLabel}>Current</Text>
            <Text style={styles.streakValue}>5 days</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <Text style={styles.streakLabel}>Longest</Text>
            <Text style={styles.streakValue}>5 days</Text>
          </View>
        </View>

        {/* History Title */}
        <Text style={styles.historyTitle}>History</Text>
      </View>

      {/* Scrollable History Section */}
      <ScrollView
        style={styles.historyScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {historyData.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.stepCount}>{item.steps}</Text>
              <Text style={styles.stepsLabel}>steps</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Ionicons
                name={item.completed ? "checkmark-circle" : "time"}
                size={20}
                color={item.completed ? "#4CAF50" : "#757575"}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: 'rgba(0, 26, 0, 1)',
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  fixedContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  blurContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  streakStatsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  streakBox: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  fireEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  streakLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  streakValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  historyScrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  stepCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  stepsLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});

export default StepHistory; 