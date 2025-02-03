import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';

const AccountSettings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    gender: '',
  });
  
  const [expandedSection, setExpandedSection] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user) {
          setUserData({
            username: user.username || '',
            email: user.email || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const handleUpdateUsername = async () => {
    // Implement username update logic
    console.log('Update username:', newUsername);
    setExpandedSection('');
    setNewUsername('');
  };

  const handleUpdateEmail = async () => {
    // Implement email update logic
    console.log('Update email:', newEmail);
    setExpandedSection('');
    setNewEmail('');
  };

  const handleUpdatePassword = async () => {
    // Implement password update logic
    console.log('Update password');
    setExpandedSection('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    console.log('Delete account');
  };

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setUserData(prev => ({ ...prev, dateOfBirth: formattedDate }));
    }
  };

  const handleUpdateDateOfBirth = () => {
    // Implement date of birth update logic
    console.log('Update date of birth:', userData.dateOfBirth);
    setExpandedSection('');
  };

  const handleUpdateGender = (gender: string) => {
    setUserData(prev => ({ ...prev, gender }));
    setExpandedSection('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Username Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('username')}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="person-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Change Username</Text>
                <Text style={styles.currentValue}>{userData.username}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'username' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {expandedSection === 'username' && (
            <View style={styles.expandedContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new username"
                placeholderTextColor="#666"
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateUsername}
              >
                <Text style={styles.updateButtonText}>Update Username</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('email')}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="mail-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Change Email</Text>
                <Text style={styles.currentValue}>{userData.email}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'email' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {expandedSection === 'email' && (
            <View style={styles.expandedContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new email"
                placeholderTextColor="#666"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateEmail}
              >
                <Text style={styles.updateButtonText}>Update Email</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Gender Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('gender')}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="person-circle-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Change Gender</Text>
                <Text style={styles.currentValue}>{userData.gender || 'Not set'}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'gender' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {expandedSection === 'gender' && (
            <View style={styles.expandedContent}>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderButton, userData.gender === 'Male' && styles.selectedGender]}
                  onPress={() => handleUpdateGender('Male')}
                >
                  <Text style={styles.genderButtonText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, userData.gender === 'Female' && styles.selectedGender]}
                  onPress={() => handleUpdateGender('Female')}
                >
                  <Text style={styles.genderButtonText}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Date of Birth Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('dob')}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Change Date of Birth</Text>
                <Text style={styles.currentValue}>{userData.dateOfBirth}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'dob' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {expandedSection === 'dob' && (
            <View style={styles.expandedContent}>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
                value={userData.dateOfBirth}
                onChangeText={(text) => setUserData(prev => ({ ...prev, dateOfBirth: text }))}
              />
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.calendarIcon} />
                <Text style={styles.calendarButtonText}>Select from Calendar</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePickerAndroid
                  value={userData.dateOfBirth ? new Date(userData.dateOfBirth) : new Date()}
                  mode="date"
                  onChange={handleDateChange}
                />
              )}
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateDateOfBirth}
              >
                <Text style={styles.updateButtonText}>Update Date of Birth</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('password')}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Update Password</Text>
                <Text style={styles.currentValue}>••••••••</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'password' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {expandedSection === 'password' && (
            <View style={styles.expandedContent}>
              <TextInput
                style={styles.input}
                placeholder="Current password"
                placeholderTextColor="#666"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor="#666"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.updateButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>

        {/* Add some bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
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
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderText: {
    marginLeft: 16,
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 14,
    color: '#666',
  },
  expandedContent: {
    padding: 16,
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2c',
  },
  input: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  calendarIcon: {
    marginRight: 4,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#007AFF',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  bottomPadding: {
    height: 20, // Adds some padding at the bottom of the scroll
  },
});

export default AccountSettings;
