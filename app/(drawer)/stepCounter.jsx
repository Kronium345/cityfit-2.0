import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { DrawerToggleButton } from '@react-navigation/drawer';
import SVG, { Circle, LinearGradient as SVGGradient, Stop, Defs, RadialGradient, Path, Line } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

// IconWithBlur Component
const IconWithBlur = ({ children }) => (
  <BlurView
    intensity={20}
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

// Progress Ring Component
const StepRingProgress = ({ radius = 150, strokeWidth = 8, progress = 0.7 }) => {
  const fill = useSharedValue(0);
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  React.useEffect(() => {
    fill.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]
  }));

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

      {/* Top text */}
      <View style={[styles.textOverlay, { top: '28%' }]}>
        <View style={styles.stepsContainer}>
          <Feather name="activity" size={16} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.stepsLabel}>Steps today</Text>
        </View>
      </View>

      {/* Center text */}
      <View style={[styles.textOverlay, { top: '37%' }]}>
        <Text style={styles.stepsText}>71</Text>
      </View>

      {/* Bottom text */}
      <View style={[styles.textOverlay, { top: '70%' }]}>
        <Text style={styles.goalText}>Daily goal: 3,600</Text>
      </View>
    </View>
  );
};

// Step Value Component
const StepValue = ({ label, value }) => (
  <View style={styles.stepValueContainer}>
    <Text style={styles.stepValue}>{value}</Text>
    <Text style={styles.stepLabel}>{label}</Text>
  </View>
);

// Streak Counter Start
const StreakCounter = ({ days = 0 }) => (
  <View style={styles.streakContainer}>
    <Text style={styles.fireEmoji}>🔥</Text>
    <Text style={styles.streakText}>{days} days</Text>
    <Feather name="chevron-right" size={16} color="#fff" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 4, paddingLeft: 5, borderRadius: 50, marginLeft: 2 }} />
  </View>
);
// Streak Counter End


// Main Component Start
const StepCounter = () => {
  return (
    <LinearGradient
      colors={['#000000', '#004400', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <View style={{ width: 40 }} />
        <StreakCounter days={0} />
      </View>

      <View style={styles.content}>
        <StepRingProgress radius={150} progress={0.7} />

        {/* Run Club Button */}
        <TouchableOpacity style={styles.boostButton}>
          <View style={styles.boostContent}>
            <Feather name="bar-chart" size={18} color="#fff" />
            <Text style={styles.boostText}>Step More With Our Run Club</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>71</Text>
            <Text style={styles.statLabel}>Steps Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3,600</Text>
            <Text style={styles.statLabel}>Daily Goal</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Weekly Avg</Text>
          </View>
        </View>

        {/* Week >> Day Steps Data View */}
        <WeekView />

      </View>
      <StatusBar style="light" />
    </LinearGradient>
  );
};
// Main Component End


// Week >> Day Steps Data Component Start
const DayCircle = ({ day, progress = 0, isActive = false }) => (
  <View style={styles.dayColumn}>
    <SVG width={32} height={32} viewBox="0 0 32 32">
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
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth={4}
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

// Expanded graph View Start
const WeeklyGraph = ({ data }) => (
  <BlurView intensity={20} tint="dark" style={styles.graphBlurContainer}>
    <View style={styles.graphContainer}>
      <SVG height={100} width="100%" style={styles.graph}>
        {/* Single horizontal line */}
        <Line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={2}
        />

        {/* Connect points with lines */}
        <Path
          d={`
            M ${data.map((_, i) => `${(i * (100/6))}% ${80 - (data[i].steps / 10000 * 60)}`).join(' L ')}
          `}
          stroke="white"
          strokeWidth={2}
          fill="none"
        />

        {/* Points */}
        {data.map((point, i) => (
          <Circle
            key={i}
            cx={`${i * (100/6)}%`}
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
                { left: `${i * (100/6)}%`, transform: [{ translateX: -28 }], transform: [{ translateY: -15 }] }
              ]}
            >
              {point.steps >= 1000 ? `${(point.steps/1000).toFixed(1)}K` : point.steps}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </BlurView>
);

// Update the WeekView component to handle expansion
const WeekView = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      
      <TouchableOpacity 
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Feather 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>

      {isExpanded && <WeeklyGraph data={days} />}
    </View>
  );
};
// Week >> Day Steps Data Component End


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    paddingTop: 30,
  },
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
  boostButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 40,
    marginBottom: 30,
  },
  boostContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  boostText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 10,
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
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
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
    marginTop: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
  },
  // Progress Ring Styles
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepsIcon: {
    marginRight: 8,
  },
  stepsIcon: {
    marginRight: 8,
  },
  // Step Value Styles
  stepValueContainer: {
    alignItems: 'center',
  },
  stepValue: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  stepLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  weekContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  graphBlurContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '95%',
    alignSelf: 'center',
  },
  graphContainer: {
    width: '100%',
    height: 160,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  graph: {
    width: '100%',
  },
  stepLabels: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
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
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
  },
});

export default StepCounter;
