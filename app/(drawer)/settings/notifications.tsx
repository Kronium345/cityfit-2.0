import { View, Text, StyleSheet, Linking, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
