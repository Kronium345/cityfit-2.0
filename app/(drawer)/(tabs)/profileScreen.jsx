import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Expo Image Picker
import { BlurView } from 'expo-blur';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState(''); // State to hold the avatar URL
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('calendar'); // Add this state

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log("Fetched user data:", response.data);  // Log the fetched data
          setUserData(response.data);
          setWeight(response.data.weight || '');
          setExperience(response.data.experience || '');
          setGender(response.data.gender || '');
          setAvatar(response.data.avatar || ''); // Set the avatar URL here

          // Log the avatar to verify
          console.log("User avatar path:", response.data.avatar);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');
    try {
      const updatedData = { weight, experience, gender };
      const response = await axios.put(`http://localhost:5000/user/${user._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setEditing(false);
      setAvatar(response.data.avatar || ''); // Update avatar after saving changes

      // Log updated avatar
      console.log("Updated avatar path:", response.data.avatar);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle selecting an image from the device
  const pickImage = async () => {
    try {
      // Request permissions to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to access your photos.');
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],  // Ensure it's properly set
        allowsEditing: true,
        aspect: [1, 1],  // Ensuring a square crop
        quality: 1,  // High quality
      });

      // Check if the user selected a file (not canceled)
      if (!result.canceled) {
        console.log('Image selected:', result);

        const imageUri = result.assets[0].uri; // Get URI of selected image
        setAvatar(imageUri);  // Set avatar URL with the new selected image URI
        uploadImage(imageUri);  // Call the upload function
      } else {
        console.log('Image selection was canceled');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  // Handle uploading the selected image
  const uploadImage = async (uri) => {
    setLoadingImage(true); // Show loading spinner while uploading

    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');
    
    // Set file type based on URI
    const fileType = uri.split('.').pop() === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('avatar', {
      uri,  // URI of the image selected
      type: fileType, // Dynamically set MIME type
      name: `avatar.${fileType === 'image/png' ? 'png' : 'jpg'}`, // Set file name with appropriate extension
    });

    try {
      // Sending the image file to the backend using PUT request
      const response = await axios.put(
        `http://localhost:5000/user/${user._id}/avatar`,  // Your backend endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',  // Ensure correct content type
          },
        }
      );

      console.log('Image uploaded successfully:', response.data);
      setAvatar(response.data.avatar);  // Set the updated avatar from the response
      Alert.alert('Success', 'Your profile image has been updated!');
      // No navigation to weightInput screen as you requested
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload your profile picture. Please try again.');
    } finally {
      setLoadingImage(false);  // Hide loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../../assets/images/food-image-2.jpg')}
          style={styles.bannerImage}
        />
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {avatar ? (
              <Image
                source={{
                  uri: avatar.includes('http')
                    ? avatar
                    : `http://localhost:5000/${avatar.replace(/\\/g, '/')}`
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../../../assets/images/logo-img/person-icon.jpg')}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <Ionicons name="add-circle" size={24} color="rgba(0, 0, 0, 1)" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.firstName || ''}</Text>
            <Text style={styles.profileEmail}>{userData.email || ''}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>850</Text>
          <Text style={styles.statLabel}>Recipes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Add Edit Profile Button */}
      <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => router.push('/(drawer)/settings/profile')}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        
      {/* Icon Row */}
      <View style={styles.iconRow}>
          <TouchableOpacity 
            style={[styles.iconButton, selectedTab === 'calendar' && styles.selectedIcon]}
            onPress={() => setSelectedTab('calendar')}
          >
            <View style={styles.iconContent}>
              <Ionicons name="calendar-outline" size={24} color={selectedTab === 'calendar' ? '#007AFF' : '#666'} />
              {selectedTab === 'calendar' && <Text style={styles.iconText}>Calendar</Text>}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconButton, selectedTab === 'measurements' && styles.selectedIcon]}
            onPress={() => setSelectedTab('measurements')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="ruler" size={24} color={selectedTab === 'measurements' ? '#007AFF' : '#666'} />
              {selectedTab === 'measurements' && <Text style={styles.iconText}>Measurements</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.iconButton, selectedTab === 'steps' && styles.selectedIcon]}
            onPress={() => setSelectedTab('steps')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="shoe-print" size={24} color={selectedTab === 'steps' ? '#007AFF' : '#666'} />
              {selectedTab === 'steps' && <Text style={styles.iconText}>Steps</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.iconButton, selectedTab === 'exercises' && styles.selectedIcon]}
            onPress={() => setSelectedTab('exercises')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="dumbbell" size={24} color={selectedTab === 'exercises' ? '#007AFF' : '#666'} />
              {selectedTab === 'exercises' && <Text style={styles.iconText}>Exercises</Text>}
            </View>
          </TouchableOpacity>
        </View>

      {/* No Data Box */}
      <View style={styles.noDataBox}>
        <MaterialCommunityIcons name="chart-line" size={40} color="#666" />
        <Text style={styles.noDataText}>
          {selectedTab === 'calendar' && 'No scheduled workouts yet'}
          {selectedTab === 'measurements' && 'No measurements recorded yet'}
          {selectedTab === 'steps' && 'No step data available yet'}
          {selectedTab === 'exercises' && 'No exercise history yet'}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={userData.firstName || ''}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={userData.lastName || ''}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userData.email || ''}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          value={weight}
          editable={editing}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Experience Level:</Text>
        <Picker
          selectedValue={experience}
          onValueChange={(itemValue) => setExperience(itemValue)}
          enabled={editing}
          style={styles.input}
        >
          <Picker.Item label="Beginner" value="Beginner" />
          <Picker.Item label="Intermediate" value="Intermediate" />
          <Picker.Item label="Advanced" value="Advanced" />
          <Picker.Item label="Pro" value="Pro" />
          <Picker.Item label="Elite" value="Elite" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender:</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          enabled={editing}
          style={styles.input}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={editing ? handleSave : handleEditToggle}
      >
        <Text style={styles.editButtonText}>
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 160, 
    position: 'relative',
    marginTop: -90,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  profileSection: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    top: 60,
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editIcon: {
    top: 138,
    position: 'absolute',
    bottom: 0,
    left: 80,
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
    top: 60,
    textShadow: '0 0 6px rgba(0, 0, 0, 0.4)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    // backgroundColor: '#fff',
    // boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    marginTop: 115,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    textShadow: '0 0 6px rgba(0, 0, 0, 0.4)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  editProfileButton: {
    backgroundColor: '#fff',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  editProfileText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 8,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iconButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  iconContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  selectedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  iconText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  noDataBox: {
    backgroundColor: '#fff',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  noDataText: {
    color: '#000',
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
