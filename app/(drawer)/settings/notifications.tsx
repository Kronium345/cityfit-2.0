import { View, Text, StyleSheet, Linking, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Push Notifications</Text>
      </View>


      {/* Notification settings */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Follows</Text>
          <Switch
            value={notificationStates.follows}
            onValueChange={() => toggleSwitch('follows')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Likes on your workouts</Text>
          <Switch
            value={notificationStates.workoutLikes}
            onValueChange={() => toggleSwitch('workoutLikes')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Comments on your workouts</Text>
          <Switch
            value={notificationStates.workoutComments}
            onValueChange={() => toggleSwitch('workoutComments')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingText}>Comment Mentions</Text>
            <Text style={styles.settingDescription}>
              Get a notification when someone @ mentions you in a comment.
            </Text>
          </View>
          <Switch
            value={notificationStates.commentMentions}
            onValueChange={() => toggleSwitch('commentMentions')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingText}>Workout Discussions</Text>
            <Text style={styles.settingDescription}>
              Get a notification when someone comments on a workout that you've also commented on.
            </Text>
          </View>
          <Switch
            value={notificationStates.workoutDiscussions}
            onValueChange={() => toggleSwitch('workoutDiscussions')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingText}>Subscribe to Hevy emails</Text>
            <Text style={styles.settingDescription}>
              Tips, new feature announcements, offers and more.
            </Text>
          </View>
          <Switch
            value={notificationStates.emailSubscription}
            onValueChange={() => toggleSwitch('emailSubscription')}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Rest Timer</Text>
          <Switch
            value={notificationStates.restTimer}
            onValueChange={() => toggleSwitch('restTimer')}
            color={theme.colors.primary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  settingsContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2c',
    backgroundColor: '#000000',
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  settingDescription: {
    color: '#666666',
    fontSize: 13,
    marginTop: 4,
    maxWidth: '90%',
  },
});
