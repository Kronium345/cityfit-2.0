import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Expo Image Picker

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState(''); // State to hold the avatar URL
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
<<<<<<< Updated upstream
          const response = await axios.get(`http://192.168.1.216:5000/user/${user._id}`, {
=======
          const response = await axios.get(`http://10.210.8.238:5000/user/${user._id}`, {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      const response = await axios.put(`http://192.168.1.216:5000/user/${user._id}`, updatedData, {
=======
      const response = await axios.put(`http://10.210.8.238:5000/user/${user._id}`, updatedData, {
>>>>>>> Stashed changes
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
        `http://192.168.1.216:5000/user/${user._id}/avatar`,  // Your backend endpoint
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
    <View style={tw`flex-1 bg-gray-100`}>
      <ScrollView>
        <View style={tw`p-6`}>
          <View style={styles.profileHeader}>
            {avatar ? (
              // Log the final image URL
              console.log("Displaying avatar with URL:", `http://192.168.1.216:5000/${avatar}`),
              <Image
                source={{
                  uri: avatar.includes('http')
                    ? avatar // If it's already a full URL, use it directly
                    : `http://192.168.1.216:5000/${avatar.replace(/\\/g, '/')}` // If it's a file path, prepend the backend URL
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
            <TouchableOpacity onPress={pickImage} style={styles.cameraIcon}>
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.firstName || ''}</Text>
              <Text style={styles.profileEmail}>{userData.email || ''}</Text>
            </View>
          </View>

          <View style={styles.divider} />

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
});

export default ProfileScreen;
