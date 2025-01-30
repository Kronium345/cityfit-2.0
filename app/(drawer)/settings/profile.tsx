import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    router.back();
  };

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity>
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Describe yourself"
          placeholderTextColor="#666"
          multiline
        />

        <Text style={styles.label}>Link</Text>
        <TextInput
          style={styles.input}
          value={link}
          onChangeText={setLink}
          placeholder="https://example.com"
          placeholderTextColor="#666"
          keyboardType="url"
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
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
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePictureText: {
    color: '#007AFF',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    padding: 16,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
