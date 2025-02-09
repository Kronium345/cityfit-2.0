import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  withTiming, 
  withRepeat, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated';

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


const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  // Adding Editing State
  const [editing, setEditing] = useState(false);


  const [userData, setUserData] = useState({
    name: '',
    weight: '',
    experienceLevel: '',
    email: '',
    bio: '',
    avatar: '',
    gender: ''
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
            experienceLevel: userData.experienceLevel,
            gender: userData.gender,
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setIsSaving(false);
        setEditing(false); // Disable edit mode after saving
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

          <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditing(!editing)}></TouchableOpacity>

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
                editable={editing}
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
                editable={editing}
              />
            </View>
            {/* Weight End */}

            {/* Gender Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <Picker
                selectedValue={userData.gender}
                onValueChange={(itemValue) => setUserData(prev => ({ ...prev, gender: itemValue }))}
                enabled={editing}
                style={styles.picker}
                dropdownIconColor="#fff"  // Makes the dropdown icon white
                mode="dropdown"
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {/* Gender End */}


            {/* Experience Level Start */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Experience Level</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <Picker
                selectedValue={userData.experienceLevel}
                onValueChange={(itemValue) => setUserData(prev => ({ ...prev, experienceLevel: itemValue }))}
                enabled={editing}
                style={styles.picker}
                dropdownIconColor="#fff"  // Makes the dropdown icon white
                mode="dropdown" // Ensures a better dropdown display on Android
              >
                <Picker.Item label="Beginner" value="Beginner" />
                <Picker.Item label="Intermediate" value="Intermediate" />
                <Picker.Item label="Advanced" value="Advanced" />
                <Picker.Item label="Pro" value="Pro" />
                <Picker.Item label="Elite" value="Elite" />
              </Picker>
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
                // editable={editing}
              />
            </View>
            {/* Description End */}
          </View>
          {/* Input Fields End */}


          {/* Save Button Start */}
          {/* Edit Profile / Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.saveButtonText}>
              {editing ? "Save Changes" : "Edit Profile"}
            </Text>
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

    </View>
  );
};


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

  // Profile Image Start
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
  // Profile Image End

  // Input Fields Start
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
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: 8,
    padding: 4,
  },

  // Input Fields End

  // Save Button Start
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Save Button End

  // Loading Overlay Start
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
  // Loading Overlay End

});

export default Profile;
