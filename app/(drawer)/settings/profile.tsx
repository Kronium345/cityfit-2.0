import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    weight: '',
    experienceLevel: '',
    email: '',
    bio: '',
    avatar: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user) {
          const response = await axios.get(`http://localhost:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log("Fetched user data:", response.data);

          setUserData({
            name: response.data.firstName + ' ' + response.data.lastName || '',
            weight: response.data.weight?.toString() || '',
            email: response.data.email || '',
            bio: response.data.bio || '',
            avatar: response.data.avatar || '',
          });

          if (response.data.avatar) {
            setAvatar(response.data.avatar);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setAvatar(imageUri);
        uploadImage(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  const uploadImage = async (uri) => {
    setLoadingImage(true);
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');

    const fileType = uri.split('.').pop() === 'png' ? 'image/png' : 'image/jpeg';
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      type: fileType,
      name: `avatar.${fileType === 'image/png' ? 'png' : 'jpg'}`,
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${user._id}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAvatar(response.data.avatar);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload your profile picture.');
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userJson) {
        const user = JSON.parse(userJson);

        // First, show loading state for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Then make the API call
        await axios.put(
          `http://localhost:5000/user/${user._id}`,
          {
            firstName: userData.name.split(' ')[0],
            lastName: userData.name.split(' ')[1] || '',
            weight: userData.weight,
            bio: userData.bio,
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setIsSaving(false);
        setShowSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/(drawer)/settings');
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.section}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage}>
              {avatar ? (
                <Image
                  source={{
                    uri: avatar.includes('http')
                      ? avatar
                      : `http://localhost:5000/${avatar.replace(/\\/g, '/')}`
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="person" size={40} color="#666" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields Start */}
          <View style={styles.form}>
            {/* Name Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                placeholder="Your full name"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
              />
            </View>
            {/* Name End */}

            {/* Weight Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Weight (kg)</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                value={userData.weight}
                onChangeText={(text) => setUserData(prev => ({ ...prev, weight: text }))}
                placeholder="Your weight"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                keyboardType="numeric"
              />
            </View>
            {/* Weight End */}

            {/* Experience Level Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Experience Level</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                value={userData.experienceLevel}
                onChangeText={(text) => setUserData(prev => ({ ...prev, experienceLevel: text }))}
                placeholder="Level"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                keyboardType="numeric"
              />
            </View>
            {/* Experience Level End */}

            {/* Email Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={styles.emailContainer}>
                <TextInput
                  style={[styles.input, styles.emailInput]}
                  value={userData.email}
                  editable={false}
                  placeholder="Your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                />
                <View style={styles.verifiedIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              </View>
            </View>
            {/* Email End */}

            {/* Description Start */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={userData.bio}
                onChangeText={(text) => setUserData(prev => ({ ...prev, bio: text }))}
                placeholder="Add a description"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                multiline
              />
            </View>
            {/* Description End */}
          </View>
          {/* Input Fields End */}


          {/* Save Button Start */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          {/* Save Button End */}


          {/* Success Message Start */}
          {showSuccess && (
            <View style={styles.successContainer}>
              <BlurView intensity={20} tint="dark" style={styles.successBlur}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.successText}>Changes saved successfully!</Text>
              </BlurView>
            </View>
          )}
          {/* Success Message End */}
        </View>
      </ScrollView>


      {/* Loading Overlay Start */}
      {isSaving && (
        <View style={styles.overlay}>
          <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Saving your changes...</Text>
          </BlurView>
        </View>
      )}
      {/* Loading Overlay End */}

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
  },
  backButton: {
    marginRight: 16,
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
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  section: {
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    marginBottom: 16,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.6,
    letterSpacing: 0.65,
  },
  required: {
    color: '#ff4444',
    marginLeft: 4,
    fontSize: 14,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  bioInput: {
    paddingTop: 2,
    height: 100,
    textAlignVertical: 'top',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurOverlay: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  successContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  successBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
