import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
  const router = useRouter();

  const renderSettingItem = (icon, title, route, isPro = false) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => router.push(route)}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.proContainer}>
        <View style={styles.proLeft}>
          <Text style={styles.proTitle}>CityFit PRO</Text>
        </View>
        <TouchableOpacity style={styles.unlockButton}>
          <Text style={styles.unlockText}>Unlock</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderSettingItem('person-outline', 'Profile', '/(drawer)/settings/profile')}
          {renderSettingItem('lock-closed-outline', 'Account', '/(drawer)/settings/account')}
          {renderSettingItem('card-outline', 'Manage Subscription', '/settings/subscription')}
          {renderSettingItem('notifications-outline', 'Notifications', '/(drawer)/settings/notifications')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem('barbell-outline', 'Workouts', '/workouts')}
          {renderSettingItem('shield-outline', 'Privacy & Social', '/privacy')}
          {renderSettingItem('options-outline', 'Units', '/units')}
          {renderSettingItem('language-outline', 'Language', '/language')}
          {renderSettingItem('heart-outline', 'Health', '/health')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  proContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1c1c1c',
    marginBottom: 16,
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  unlockButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unlockText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1c1c1c',
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Settings;
