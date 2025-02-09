import { View, Text, StyleSheet, Linking, Switch, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
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


export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [notificationStates, setNotificationStates] = useState({
    follows: false,
    workoutLikes: false,
    workoutComments: false,
    commentMentions: false,
    workoutDiscussions: false,
    emailSubscription: false,
    restTimer: false,
  });

  const toggleSwitch = (key: keyof typeof notificationStates) => {
    setNotificationStates(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      <BlobBackground />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(drawer)/settings')}
          style={styles.backButton}
        >
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Push Notifications</Text>
      </View>

      {/* Notification settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Follows</Text>
            <Switch
              value={notificationStates.follows}
              onValueChange={() => toggleSwitch('follows')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Step Streak Reminders</Text>
              <Text style={styles.settingDescription}>
                Get a notification when you're about to miss a step streak.
              </Text>
            </View>
            <Switch
              value={notificationStates.workoutLikes}
              onValueChange={() => toggleSwitch('workoutLikes')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Leaderboard Alerts</Text>
              <Text style={styles.settingDescription}>
                Get a notification when your friends are about to beat your step streak.
              </Text>
            </View>
            <Switch
              value={notificationStates.workoutComments}
              onValueChange={() => toggleSwitch('workoutComments')}
            />

          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Run Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notification alerts on all upcoming community runs.
              </Text>

            </View>
            <Switch
              value={notificationStates.commentMentions}
              onValueChange={() => toggleSwitch('commentMentions')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Workout Discussions</Text>
              <Text style={styles.settingDescription}>
                Get a notification when someone comments on a workout that you've also commented on.
              </Text>
            </View>
            <Switch
              value={notificationStates.workoutDiscussions}
              onValueChange={() => toggleSwitch('workoutDiscussions')}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Subscribe to Fitness One emails</Text>
              <Text style={styles.settingDescription}>
                Tips, new feature announcements, offers and more.
              </Text>
            </View>
            <Switch
              value={notificationStates.emailSubscription}
              onValueChange={() => toggleSwitch('emailSubscription')}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Rest Preferences</Text>
            <Switch
              value={notificationStates.restTimer}
              onValueChange={() => toggleSwitch('restTimer')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 16,
    paddingTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    marginHorizontal: 20,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  settingDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 4,
    width: '90%',
  },
  settingContent: {
    flex: 1,
    paddingRight: 16,
  },
});
