import { Tabs } from 'expo-router'; // Import Link from expo-router
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; // For tab icons
import { DrawerToggleButton } from '@react-navigation/drawer'; // For drawer toggle button
import { useRouter } from 'expo-router'; // For navigation
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function _layout() {
  const router = useRouter();  // Set up router for navigation

  return (
    <Tabs screenOptions={{ 
      headerLeft: () => <DrawerToggleButton tintColor='#000' />,
    }}>
      {/* Tab for Home */}
      <Tabs.Screen 
        name="home" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Home',
          headerTitle: 'City Fit',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }} 
      />
      {/* Tab for PlanScreen */}
      <Tabs.Screen 
        name="planScreen" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" size={size} color={color} />
          ),
          tabBarLabel: 'Plan',
          headerTitle: 'Plan',
        }} 
      />
      {/* Tab for ChartScreen */}
      <Tabs.Screen 
        name="chartScreen" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart" size={size} color={color} />
          ),
          tabBarLabel: 'Charts',
          headerTitle: 'Charts',
        }} 
      />
      
      <Tabs.Screen 
        name="profileScreen" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          tabBarLabel: 'Profile',
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity 
                onPress={() => router.push('../settings')}
                style={{ marginRight: 15, padding: 5 }}
              >
                <Ionicons name="settings-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('user');
                    router.replace('/login');
                  } catch (error) {
                    console.error('Error logging out:', error);
                  }
                }}
                style={{ padding: 5 }}
              >
                <Ionicons name="log-out-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
    </Tabs>
  );
}
