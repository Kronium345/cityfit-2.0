import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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

// Milestone Badge Component Start
type Achievement = {
  steps: number;
  unlocked: boolean;
};

// Milestone Badge Data
const ACHIEVEMENTS: Achievement[] = [
  { steps: 10000, unlocked: true },
  { steps: 50000, unlocked: false },
  { steps: 75000, unlocked: false },
  { steps: 100000, unlocked: false },
  { steps: 150000, unlocked: false },
  { steps: 200000, unlocked: false },
  { steps: 250000, unlocked: false },
  { steps: 300000, unlocked: false },
  { steps: 350000, unlocked: false },
  { steps: 400000, unlocked: false },
  { steps: 450000, unlocked: false },
  { steps: 500000, unlocked: false },
  { steps: 600000, unlocked: false },
  { steps: 700000, unlocked: false },
  { steps: 800000, unlocked: false },
];

// Format Large Numbers
const formatNumber = (num: number): string => {
  return num >= 1000 ? `${num / 1000}K` : num.toString();
};
// Milestone Badge Component End

// Step History Component Start
const StepHistory = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('History');

  // Sample Histroy Data
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
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Fixed Content */}
      <View style={styles.fixedContent}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'History' && styles.activeTab]}
            onPress={() => setActiveTab('History')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'History' && styles.activeTabText
            ]}>
              History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Achievements' && styles.activeTab]}
            onPress={() => setActiveTab('Achievements')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Achievements' && styles.activeTabText
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Histroy */}
        {activeTab === 'History' ? (
          <>
            {/* Stat Box Start */}
            <View style={styles.statBoxContainer}>
              <View style={styles.statBox}>
                <Image
                  source={require('../../assets/icons/counter.png')}
                  style={styles.progressIcon}
                />
                <Text style={styles.statBoxTitle}>Best Day</Text>
                <Text style={styles.statBoxText}>10,200 Steps</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.fireEmoji}>🔥</Text>
                <Text style={styles.statBoxTitle}>Total Steps</Text>
                <Text style={styles.statBoxText}>100,200 Steps</Text>
              </View>
            </View>
            {/* Stat Box End */}

            {/* History Title */}
            <Text style={styles.historyTitle}>History</Text>
          </>
        ) : (
          // TODO: Add fixed achievements content here
          // This is where you put non-scrolling content like:
          // - Achievement summary
          // - Total achievements earned
          // - Current progress overview
          <View style={styles.achievementsContainer}>
            <Text style={styles.comingSoonText}>Achievements Coming Soon</Text>
          </View>
        )}
      </View>

      {/* Scrollable Content Section */}
      {activeTab === 'History' ? (
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
      ) : (
        <ScrollView
          style={styles.achievementsScrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* TODO: Add scrollable achievements list here
              This is where you put the actual list of achievements:
              - Individual achievement cards
              - Achievement categories
              - Detailed progress for each achievement
          */}


          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{formatNumber(achievement.steps)}</Text>
                  <Text style={styles.badgeLabel}>steps</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

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

  // Header Component Start
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  fixedContent: {
    paddingHorizontal: 20,
  },
  // Header Component End

  // Tab Component Start
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  // Tab Component End

  // Streak Stats Component Start
  statBoxContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressIcon: {
    width: 40,
    height: 40,
    marginRight: 4,
  },
  fireEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statBoxTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  statBoxText: {
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

  // Achievements Component Start
  achievementsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  achievementsScrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  comingSoonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  achievementItem: {
    width: '30%', // Approximately 3 items per row with spacing
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: 'rgba(7, 94, 7, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(7, 94, 7, 1)',
    boxShadow: '0 0 10px rgba(7, 94, 7, 0.6)',
  },
  badgeNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  // Achievements Component End
});

export default StepHistory; 