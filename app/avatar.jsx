import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Expo Image Picker

const AvatarScreen = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageUri, setImageUri] = useState(null); // Store the user's custom image URI
  const [loadingImage, setLoadingImage] = useState(false); // Track image loading state
  const router = useRouter(); // Hook to navigate

  const avatars = [
    'https://img.icons8.com/?size=100&id=FDI4JxAMODWm&format=png&color=000000',
    'https://img.icons8.com/?size=100&id=er5nhhO0Sb3Q&format=png&color=000000',
    'https://img.icons8.com/?size=100&id=gaokY6HiHgpc&format=png&color=000000',
    'https://img.icons8.com/?size=100&id=60Qzo3vVev1m&format=png&color=000000',
    'https://img.icons8.com/?size=100&id=0DmH6dXqUej1&format=png&color=000000'
  ];
  
  
  



  // Handle selecting predefined avatars
  const handleAvatarSelect = async (avatarUrl) => {
    if (!avatarUrl) {
      console.error('Avatar URL is not valid.');
      return;
    }

    setSelectedAvatar(avatarUrl); // Store the selected avatar URL

    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');

    try {
      // Sending the selected avatar URL to the backend (not uploading as file)
      const response = await axios.put(
        `http://192.168.1.216:5000/user/${user._id}/avatar`,
        { avatar: avatarUrl }, // Send the URL as avatar data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Avatar updated successfully:', response.data);
      router.push('/weightInput'); // Navigate to weight input screen after successful upload
    } catch (error) {
      console.error('Error updating avatar:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update avatar');
    }
  };

// Handle selecting an image from the device
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
      setImageUri(imageUri);  // Store the selected image URI in state
      uploadImage(imageUri);  // Call the upload function
    } else {
      console.log('Image selection was canceled');
    }
  } catch (error) {
    console.error('Error selecting image:', error);
    Alert.alert('Error', 'Something went wrong while selecting the image.');
  }
};



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
    setSelectedAvatar(response.data.avatar);  // Set the updated avatar from the response
    Alert.alert('Success', 'Your profile image has been updated!');
    router.push('/weightInput');  // Navigate to the weight input screen after uploading the image
  } catch (error) {
    console.error('Error uploading image:', error);
    Alert.alert('Error', 'Failed to upload your profile picture. Please try again.');
  } finally {
    setLoadingImage(false);  // Hide loading spinner
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select or Upload Your Avatar</Text>

      <View style={styles.avatarContainer}>
        {/* Predefined avatars */}
        {avatars.map((avatar, index) => (
          <TouchableOpacity key={index} onPress={() => handleAvatarSelect(avatar)}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.buttonText}>Upload Your Own Avatar</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.customImageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
          <TouchableOpacity onPress={() => uploadImage(imageUri)} style={styles.uploadButton}>
            <Text style={styles.buttonText}>Use This Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {loadingImage && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}
    </View>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  customImageWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  loading: {
    marginTop: 20,
  },
});

