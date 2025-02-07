import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>

        {/* Username Tab Start */}
        <View style={styles.settingsTab}>
          <TouchableOpacity
            style={styles.settingsTabHeader}
            onPress={() => toggleSection('username')}
          >
            <View style={styles.settingsTabContent}>
              <Ionicons name="person-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.settingsTabHeaderText}>
                <Text style={styles.settingsTabTitle}>Change Username</Text>
                <Text style={styles.settingsTabCurrentValue}>{userData.username}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'username' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
            />
          </TouchableOpacity>
          {expandedSection === 'username' && (
            <View style={styles.expandedContent}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new username"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateUsername}
              >
                <Text style={styles.updateButtonText}>Update Username</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Username Tab End */}

        {/* Email Tab Start */}
        <View style={styles.settingsTab}>
          <TouchableOpacity
            style={styles.settingsTabHeader}
            onPress={() => toggleSection('email')}
          >
            <View style={styles.settingsTabContent}>
              <Ionicons name="mail-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.settingsTabHeaderText}>
                <Text style={styles.settingsTabTitle}>Change Email</Text>
                <Text style={styles.settingsTabCurrentValue}>{userData.email}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'email' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
            />
          </TouchableOpacity>
          {expandedSection === 'email' && (
            <View style={styles.expandedContent}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new email"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateEmail}
              >
                <Text style={styles.updateButtonText}>Update Email</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Email Tab End */}

        {/* Gender Tab Start */}
        <View style={styles.settingsTab}>
          <TouchableOpacity
            style={styles.settingsTabHeader}
            onPress={() => toggleSection('gender')}
          >
            <View style={styles.settingsTabContent}>
              <Ionicons name="person-circle-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.settingsTabHeaderText}>
                <Text style={styles.settingsTabTitle}>Change Gender</Text>
                <Text style={styles.settingsTabCurrentValue}>{userData.gender || 'Not set'}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'gender' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
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
        {/* Gender Tab End */}

        {/* Date of Birth Tab Start */}
        <View style={styles.settingsTab}>
          <TouchableOpacity
            style={styles.settingsTabHeader}
            onPress={() => toggleSection('dob')}
          >
            <View style={styles.settingsTabContent}>
              <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.settingsTabHeaderText}>
                <Text style={styles.settingsTabTitle}>Change Date of Birth</Text>
                <Text style={styles.settingsTabCurrentValue}>{userData.dateOfBirth}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'dob' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
            />
          </TouchableOpacity>
          {expandedSection === 'dob' && (
            <View style={styles.expandedContent}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  value={userData.dateOfBirth}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, dateOfBirth: text }))}
                />
              </View>
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
        {/* Date of Birth Tab End */}

        {/* Password Tab Start */}
        <View style={styles.settingsTab}>
          <TouchableOpacity
            style={styles.settingsTabHeader}
            onPress={() => toggleSection('password')}
          >
            <View style={styles.settingsTabContent}>
              <Ionicons name="lock-closed-outline" size={24} color="#fff" style={styles.icon} />
              <View style={styles.settingsTabHeaderText}>
                <Text style={styles.settingsTabTitle}>Update Password</Text>
                <Text style={styles.settingsTabCurrentValue}>••••••••</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'password' ? 'chevron-up' : 'chevron-forward'}
              size={24}
              color="rgba(255, 255, 255, 0.8)"
            />
          </TouchableOpacity>
          {expandedSection === 'password' && (
            <View style={styles.expandedContent}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Current password"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons 
                    name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.65)" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons 
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.65)" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor="rgba(255, 255, 255, 0.65)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.65)" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdatePassword}
              >
                <Text style={styles.updateButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Password Tab End */}

        {/* Delete Account Tab Start */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
        {/* Delete Account Tab End */}

      </ScrollView>
    </LinearGradient>
  );
};

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
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
    color: '#fff',
  },
  
  // General Setting Tab Start
  settingsTab: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  settingsTabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsTabHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  settingsTabTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsTabCurrentValue: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 2,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  input: {
    color: '#fff',
    padding: 12,
    paddingHorizontal: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  updateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // General Setting Tab End

  // Gender Tab Start
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  // Gender Tab End

  // Date of Birth Tab Start
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  calendarButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  calendarIcon: {
    marginRight: 4,
  },
  // Date of Birth Tab End

  // Delete Account Tab Start
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
  // Delete Account Tab End

});

export default AccountSettings;
