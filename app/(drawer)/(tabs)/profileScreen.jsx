import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Use the correct Picker

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`http://192.168.1.216:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setUserData(response.data);
          setWeight(response.data.weight || '');
          setExperience(response.data.experience || '');
          setGender(response.data.gender || '');
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
      const response = await axios.put(`http://192.168.1.216:5000/user/${user._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6`}>
      <Text style={tw`text-3xl font-bold mb-4`}>Your Profile</Text>

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
});

export default ProfileScreen;
