import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal, Pressable, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { DrawerToggleButton } from '@react-navigation/drawer';
import SVG, { Circle, LinearGradient as SVGGradient, Stop, Defs, RadialGradient, Path, Line, Rect, LinearGradient as SVGLinearGradient } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pedometer } from 'expo-sensors';


// IconWithBlur Component Start
const IconWithBlur = ({ children }) => (
  <BlurView
    intensity={8}
    tint="light"
    style={{
      borderRadius: 12,
      overflow: 'hidden',
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }}
  >
    {children}
  </BlurView>
);
// IconWithBlur Component End


// Progress Ring Component Start
const StepRingProgress = ({ radius = 150, strokeWidth = 8, progress = 0.7, dailyGoal, stepCount }) => {
  const fill = useSharedValue(0);
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const [isTracking, setIsTracking] = useState(false);


  React.useEffect(() => {
    fill.value = withTiming(stepCount / dailyGoal, { duration: 1500 });
  }, [stepCount / dailyGoal]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]
  }));

  // UseEffect created to incorporate Pedometer API
  useEffect(() => {
    // Start tracking steps
    const startTracking = async () => {
      const { isAvailable } = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const stepSubscription = Pedometer.watchStepCount((result) => {
          setStepCount(result.steps);
        });
        setIsTracking(true);
  
        // Clean up the subscription when component is unmounted
        return () => stepSubscription.remove();
      }
    };
  
    startTracking();
  
    // Cleanup function when the component is unmounted
    return () => {
      if (isTracking) {
        Pedometer.stopWatching();
      }
    };
  }, []);
  

  return (
    <View style={{ width: radius * 2, height: radius * 2, alignSelf: "center" }}>
      <SVG width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <Defs>
          <SVGGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF1493" />
            <Stop offset="1" stopColor="#FFA500" />
          </SVGGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="rgba(0, 0, 0, 0.2)"
        />

        {/* Progress circle */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>

      {/* Main Circle Top text */}
      <View style={[styles.textOverlay, { top: '28%' }]}>
        <View style={styles.stepsContainer}>
          <Feather name="activity" size={16} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.stepsLabel}>Steps today</Text>
        </View>
      </View>

      {/* Main Circle Center text */}
      <View style={[styles.textOverlay, { top: '37%' }]}>
        <Text style={styles.stepsText}>{stepCount}</Text>
      </View>

      {/* Main Circle Bottom text */}
      <View style={[styles.textOverlay, { top: '70%' }]}>
        <Text style={styles.goalText}>Daily goal: {dailyGoal?.toLocaleString()}</Text>
      </View>
    </View>
  );
};
// Progress Ring Component End


// Streak Counter Start
const StreakCounter = ({ days = 0 }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.streakContainer}
      onPress={() => router.push('/stepHistory')}
    >
      <Text style={styles.fireEmoji}>🔥</Text>
      <Text style={styles.streakText}>Progress</Text>
      <Feather 
        name="chevron-right" 
        size={16} 
        color="#fff" 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          padding: 4, 
          paddingLeft: 5, 
          borderRadius: 50, 
          marginLeft: 2 
        }} 
      />
    </TouchableOpacity>
  );
};
// Streak Counter End


// Grid Terrain Component Start
const GridTerrain = () => {
  return (
    <View style={styles.terrainContainer}>
      <SVG width="100%" height="1200" style={styles.terrainSVG}>
        {/* Dense perspective lines converging to center */}
        {[...Array(60)].map((_, i) => (
          <Path
            key={`center-${i}`}
            d={`M ${200 + (i - 30) * 15} 1200 L ${200 + (i - 30) * 45} 0`}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.4"
          />
        ))}

        {/* Dense horizontal cross lines */}
        {[...Array(120)].map((_, i) => (
          <Path
            key={`cross-${i}`}
            d={`M -200 ${100 + (i * 8)} L 600 ${100 + (i * 8)}`}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.4"
          />
        ))}
      </SVG>
    </View>
  );
};
// Grid Terrain Component End


// Main Component Start
const StepCounter = () => {
  const [dailyGoal, setDailyGoal] = useState(4500);
    // UseStates for step counts for tracking
    const [stepCount, setStepCount] = useState(0);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#000000', '#004400', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <GridTerrain />
      
      <View style={styles.headerContainer}>
        <View style={{ width: 40 }} />
        <StreakCounter days={0} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <StepRingProgress 
            radius={150} 
            dailyGoal={dailyGoal}
            stepCount={stepCount}
          />

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stepCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps Today</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyGoal.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Daily Goal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2,450</Text>
              <Text style={styles.statLabel}>Weekly Avg</Text>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            {/* Run Club Button */}
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}>
              <View style={styles.actionBtnContent}>
                <Feather name="bar-chart" size={18} color="#fff" />
                <Text style={styles.actionBtnText}>Our Run Club</Text>
              </View>
            </TouchableOpacity>

            {/* Change Goal Button */}
            <TouchableOpacity 
              style={[styles.actionBtn, { flex: 1, marginLeft: 8 }]}
              onPress={() => setIsGoalModalVisible(true)}
            >
              <View style={styles.actionBtnContent}>
                <Feather name="target" size={18} color="#fff" />
                <Text style={styles.actionBtnText}>Adjust Goal</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Week View and Total Steps Progress */}
          <WeekView />
          <TotalStepsProgress />
          <FriendsList />
        </View>
      </ScrollView>
      <StatusBar style="light" />

      <GoalAdjustmentModal 
        isVisible={isGoalModalVisible}
        onClose={() => setIsGoalModalVisible(false)}
        currentGoal={dailyGoal}
        onGoalChange={setDailyGoal}
      />
    </LinearGradient>
  );
};
// Main Component End


// Week >> Day Steps Data Component Start
const DayCircle = ({ day, progress = 0, isActive = false }) => (
  <View style={styles.dayColumn}>
    <SVG width={22} height={28} viewBox="0 0 32 32">
      <Circle
        cx={16}
        cy={16}
        r={14}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={4}
        fill="transparent"
      />
      <Circle
        cx={16}
        cy={16}
        r={14}
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth={3}
        strokeDasharray={`${2 * Math.PI * 14 * progress} ${2 * Math.PI * 14}`}
        strokeLinecap="round"
        fill="transparent"
        transform={`rotate(-90 16 16)`}
      />
    </SVG>
    <Text style={[
      styles.dayText,
      isActive && styles.activeDayText
    ]}>{day}</Text>
  </View>
);

const WeekView = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const days = [
    { day: 'Thu', progress: 0.3, steps: 690 },
    { day: 'Fri', progress: 0.5, steps: 8600 },
    { day: 'Sat', progress: 0.7, steps: 905 },
    { day: 'Sun', progress: 0.2, steps: 7300 },
    { day: 'Mon', progress: 0.8, steps: 4300 },
    { day: 'Tue', progress: 0.4, steps: 8200 },
    { day: 'Wed', progress: 0.6, steps: 175 },
  ];

  return (
    <View style={styles.weekContainer}>
      <View style={styles.weekView}>
        {days.map((item, index) => (
          <DayCircle
            key={item.day}
            day={item.day}
            progress={item.progress}
            isActive={index === 3}
          />
        ))}
      </View>
      
      {isExpanded ? (
        <>
          <WeeklyGraph data={days} />
          <TouchableOpacity 
            style={styles.expandButtonExpanded}
            onPress={() => setIsExpanded(false)}
          >
            <Feather name="chevron-up" size={24} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Feather name="chevron-down" size={24} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      )}
    </View>
  );
};
// Week >> Day Steps Data Component End


// Expanded graph View Start
const WeeklyGraph = ({ data }) => (
  <View style={styles.graphOuterContainer}>
    {/* Background blur layer */}
    <BlurView 
      intensity={8} 
      tint="dark" 
      style={styles.graphBlurBackground}
    />
    
    {/* Content layer */}
    <View style={styles.graphContainer}>
      <SVG height={100} width="100%" style={styles.graph}>
        {/* Single horizontal line */}
        <Line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={1.5}
          strokeDasharray="8, 4"
          strokeLinecap="round"
        />

        {/* Connect points with lines */}
        <Path
          d={`
            M ${data.map((_, i) => `${5 + (i * 90/6)}% ${80 - (data[i].steps / 10000 * 60)}`).join(' L ')}
          `}
          stroke="white"
          strokeWidth={2}
          fill="none"
        />

        {/* Points */}
        {data.map((point, i) => (
          <Circle
            key={i}
            cx={`${5 + (i * 90/6)}%`}
            cy={80 - (point.steps / 10000 * 60)}
            r={4}
            fill="white"
          />
        ))}
      </SVG>

      {/* Step labels */}
      <View style={styles.stepLabels}>
        <View style={styles.labelRow}>
          {data.map((point, i) => (
            <Text 
              key={i} 
              style={[
                styles.stepCount,
                { left: `${5 + (i * 90/6)}%`, transform: [{ translateX: -20 }] }
              ]}
            >
              {point.steps >= 1000 ? `${(point.steps/1000).toFixed(1)}K` : point.steps}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </View>
);
// Expanded graph View End


// Total Steps Progress Component Start
const TotalStepsProgress = ({ totalSteps = 10900 }) => {
  const formattedSteps = (totalSteps/1000).toFixed(1) + 'K';
  const nextMilestone = Math.ceil(totalSteps/50000) * 50000;
  const progress = totalSteps/nextMilestone;
  
  return (
    <View style={styles.totalStepsContainer}>
      {/* Background blur layer */}
      <BlurView 
        intensity={8} 
        tint="dark" 
        style={styles.totalStepsBlurBackground}
      />
      
      {/* Content layer */}
      <View style={styles.totalStepsContent}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <IconWithBlur>
            <Feather name="award" size={20} color="#fff" />
          </IconWithBlur>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.totalStepsTitle}>Steps since you joined</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.currentSteps}>{formattedSteps}</Text>
              <Text style={styles.milestoneSteps}>{(nextMilestone/1000) + 'K'}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
// Total Steps Progress Component Start


// Change Goal Modal Start
const GoalAdjustmentModal = ({ isVisible, onClose, currentGoal, onGoalChange }) => {
  const [goal, setGoal] = useState(currentGoal);
  const modalAnimation = useSharedValue(0);
  
  // Function to determine recommendation text and color
  const getRecommendationInfo = (steps) => {
    if (steps <= 4400) {
      return {
        text: 'Easy Goal',
        color: '#4CAF50', // Green
        backgroundColor: 'rgba(74, 175, 80, 0.25)',
        icon: 'smile'
      };
    } else if (steps >= 4600) {
      return {
        text: 'Challenging Goal',
        color: '#FF5722', // Orange
        backgroundColor: 'rgba(255, 87, 34, 0.25)',
        icon: 'trending-up'
      };
    } else {
      return {
        text: 'Recommended',
        color: '#7c3aed', // Purple
        backgroundColor: 'rgba(124, 58, 237, 0.25)',
        icon: 'zap'
      };
    }
  };

  const recommendationInfo = getRecommendationInfo(goal);

  const RecommendationBadge = ({ info }) => (
    <TouchableOpacity 
      style={[styles.recommendationBadge, { backgroundColor: info.backgroundColor }]}
      onPress={() => setGoal(4500)}
    >
      <Feather 
        name={info.icon} 
        size={16} 
        color={info.color} 
        style={styles.recommendationIcon} 
      />
      <Text style={styles.recommendationText}>
        {info.text}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    modalAnimation.value = withSpring(isVisible ? 1 : 0);
  }, [isVisible]);

  const modalStyle = useAnimatedStyle(() => {
    return {
      opacity: modalAnimation.value,
      transform: [
        {
          translateY: interpolate(
            modalAnimation.value,
            [0, 1],
            [100, 0]
          )
        }
      ]
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: modalAnimation.value * 0.5,
    };
  });

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalOverlay, overlayStyle]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        
        <Animated.View style={[styles.modalContent, modalStyle]}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Set your daily goal</Text>
          <Text style={styles.modalSubtitle}>Achieve your daily goal to continue your streak</Text>
          
          <View style={styles.goalAdjuster}>
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => setGoal(prev => Math.max(1000, prev - 100))}
            >
              <Feather name="minus" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.goalDisplay}>
              <Text style={styles.goalValue}>{goal.toLocaleString()}</Text>
              <Text style={styles.goalUnit}>steps</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.adjustButton}
              onPress={() => setGoal(prev => Math.min(50000, prev + 100))}
            >
              <Feather name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <RecommendationBadge info={recommendationInfo} />

          <TouchableOpacity 
            style={styles.setGoalButton}
            onPress={() => {
              onGoalChange(goal);
              onClose();
            }}
          >
            <Text style={styles.setGoalButtonText}>Set up Daily Goal</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
// Change Goal Modal End


// Social Component Start
const FriendsList = () => {
  const [activeTab, setActiveTab] = useState('Streaks');
  const [shareEnabled, setShareEnabled] = useState(true);
  const router = useRouter();

  // Data for different tabs
  const friendsData = {
    streaks: [
      { id: 1, name: 'ro', streaks: 5, avatar: 'R' },
      { id: 2, name: 'Killa', streaks: 4, avatar: 'K' },
      { id: 3, name: 'Jacob', streaks: 0, avatar: 'J' },
      { id: 4, name: 'Daniel', streaks: 0, avatar: 'A' },
      { id: 5, name: 'Trump', streaks: 0, avatar: 'S' },
    ],
    stepsToday: [
      { id: 1, name: 'Killa', steps: 9235, avatar: 'K' },
      { id: 2, name: 'Jacob', steps: 0, avatar: 'J' },
      { id: 3, name: 'ro', steps: 0, avatar: 'R' },
      { id: 4, name: 'Daniel', steps: 0, avatar: 'A' },
      { id: 5, name: 'Trump', steps: 0, avatar: 'S' },
    ],
    stepsWeek: [
      { id: 1, name: 'Killa', steps: 45235, avatar: 'K' },
      { id: 2, name: 'Jacob', steps: 32150, avatar: 'J' },
      { id: 3, name: 'ro', steps: 28430, avatar: 'R' },
      { id: 4, name: 'Daniel', steps: 25800, avatar: 'A' },
      { id: 5, name: 'Trump', steps: 21650, avatar: 'S' },
    ],
  };

  const renderFriendRow = (friend, index) => {
    const value = activeTab === 'Streaks' 
      ? `${friend.streaks} streaks`
      : `${friend.steps.toLocaleString()} steps`;

    return (
      <View key={friend.id} style={styles.friendRow}>
        <View style={styles.friendInfo}>
          <Text style={styles.friendRank}>{index + 1}</Text>
          <View style={styles.friendAvatar}>
            <Text style={styles.avatarText}>{friend.avatar}</Text>
          </View>
          <Text style={styles.friendName}>{friend.name}</Text>
        </View>
        <Text style={styles.streakCount}>{value}</Text>
      </View>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'Streaks':
        return friendsData.streaks;
      case 'Steps today':
        return friendsData.stepsToday;
      case 'Steps this week':
        return friendsData.stepsWeek;
      default:
        return friendsData.streaks;
    }
  };

  return (
    <View style={styles.friendsContainer}>
      <BlurView 
        intensity={8} 
        tint="dark" 
        style={styles.friendsBlurBackground}
      />
      
      <View style={styles.friendsContent}>
        <Text style={styles.friendsTitle}>Your friends</Text>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'Streaks' && styles.activeTab
            ]}
            onPress={() => setActiveTab('Streaks')}
          >
            <Text style={styles.tabText}>Streaks 🔥</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'Steps today' && styles.activeTab
            ]}
            onPress={() => setActiveTab('Steps today')}
          >
            <Text style={styles.tabText}>Steps today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'Steps this week' && styles.activeTab
            ]}
            onPress={() => setActiveTab('Steps this week')}
          >
            <Text style={styles.tabText}>Steps this week</Text>
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        {getCurrentData().map((friend, index) => renderFriendRow(friend, index))}

        {/* See All Button */}
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => router.push('/stepLeaderboard')}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>

        {/* Share Toggle */}
        <View style={styles.shareContainer}>
          <View style={styles.shareTextContainer}>
            <Text style={styles.shareTitle}>Share steps with followers</Text>
            <Text style={styles.shareSubtitle}>We'll share your steps with people that follow you</Text>
          </View>
          <Switch
            value={shareEnabled}
            onValueChange={setShareEnabled}
            trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(0, 255, 0, 0.3)' }}
            thumbColor={shareEnabled ? '#00ff00' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
};
// Social Component End


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  fireEmoji: {
    fontSize: 16,
  },
  streakText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingTop: 10,
  },

  // Grid Terrain Styles Start
  terrainContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  terrainSVG: {
    transform: [
      { perspective: 1000 },
      { rotateX: '65deg' },
      { scale: 1.5 },
      { translateY: -50 }
    ],
    position: 'absolute',
    top: -200,
    opacity: 0.25,
  },
  // Grid Terrain Styles End

  // Main Circle Text Start
  textOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepsLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },
  stepsText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 72,
  },
  goalText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  // Main Circle Text End

  // Quick Stats Row Start
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  // Quick Stats Row End

  // Action Buttons Row Start
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  actionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Action Buttons Row End

  // Week >> Day Steps Data  Start
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 2,
    alignSelf: 'center',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 8,
  },
  dayText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  activeDayText: {
    opacity: 1,
    fontWeight: '500',
  },
  expandButton: {
    alignSelf: 'center',
    
  },
  expandButtonExpanded: {
    alignSelf: 'center',
  },
  weekContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  graphOuterContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.25)',
    borderWidth: '0.5px',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    alignSelf: 'center',
  },
  graphContainer: {
    width: '100%',
    height: 140,
    paddingHorizontal: 10,
  },
  graph: {
    width: '100%',
  },
  stepLabels: {
    position: 'absolute',
    bottom: 40,
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  labelRow: {
    width: '100%',
    position: 'relative',
  },
  stepCount: {
    position: 'absolute',
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    width: 40,
    borderWidth: '0.5px',
    borderRadius: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
  },
  // Line Graph End

  // Total Steps Component Start
  totalStepsContainer: {
    marginTop: 2,
    marginBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
  },
  totalStepsBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalStepsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  progressSection: {
    flex: 1,
  },
  totalStepsTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  currentSteps: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  milestoneSteps: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  // Total Steps Component End

  // Change Goal Modal Start
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalContent: {
    backgroundColor: '#003300',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    boxShadow: '0 0 24px rgba(0, 0, 0, 0.45)',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  goalAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalDisplay: {
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 40,
    fontWeight: 600,
    color: '#fff',
  },
  goalUnit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  recommendationIcon: {
    marginRight: 8,
  },
  recommendationText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
  },
  setGoalButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  setGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Change Goal Modal End

  // Social Component Start
  friendsContainer: {
    marginBottom: 120,
    paddingHorizontal: 16,
    position: 'relative',
  },
  friendsBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  friendsContent: {
    padding: 16,
  },
  friendsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendRank: {
    color: '#fff',
    width: 24,
    fontSize: 14,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  friendName: {
    color: '#fff',
    fontSize: 14,
  },
  streakCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  seeAllButton: {
    alignItems: 'center',    
  },
  seeAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  shareTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  shareTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  shareSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  // Social Component End
});




export default StepCounter;
