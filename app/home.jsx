import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const Home = () => {
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6`}>
      <Text style={tw`text-3xl font-bold mb-2`}>Welcome, {userData.firstName} {userData.lastName}</Text>
      <Text style={tw`text-lg mb-8`}>Your Fitness Journey starts here!</Text>
      <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, tw`mt-4`]}>
        <Text style={tw`text-white text-center`}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Home;
