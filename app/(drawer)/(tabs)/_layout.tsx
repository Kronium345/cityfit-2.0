import { Tabs } from 'expo-router'; // Import Tabs from expo-router
import { Feather, AntDesign } from '@expo/vector-icons'; // For tab icons
import { DrawerToggleButton } from '@react-navigation/drawer'; // For drawer toggle button
import { useRouter } from 'expo-router'; // For navigation
import React from 'react';

export default function _layout() {
  const router = useRouter();  // Set up router for navigation

  return (
    <Tabs screenOptions={{ headerLeft: () => <DrawerToggleButton tintColor='#000' /> }}>
      {/* Tab for Home */}
      <Tabs.Screen 
        name="home" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Home',
          headerTitle: 'Home',
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
      {/* Tab for ProfileScreen */}
      <Tabs.Screen 
        name="profileScreen" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          tabBarLabel: 'Profile',
          headerTitle: 'Profile',
        }} 
      />
    </Tabs>
  );
}
