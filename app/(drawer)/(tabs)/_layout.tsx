import { Tabs } from 'expo-router'; // Import Link from expo-router
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; // For tab icons
import { DrawerToggleButton } from '@react-navigation/drawer'; // For drawer toggle button
import { useRouter } from 'expo-router'; // For navigation
import React, { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

export default function _layout() {
  const router = useRouter();  // Set up router for navigation

  const IconWithBlur = ({ children, intensity = 20, style = {}, backgroundColor = 'rgba(0, 0, 0, 0.3)' }: { 
    children: ReactNode; 
    intensity?: number; 
    style?: object;
    backgroundColor?: string;
  }) => (
    <BlurView 
      intensity={intensity} 
      tint="light"
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,  
        ...style
      }}
    >
      {children}
    </BlurView>
  );

  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleStyle: {
          color: '#fff',
          fontSize: 20,
          fontWeight: '500',
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ marginLeft: 12 }}>
            <IconWithBlur>
              <DrawerToggleButton tintColor='#fff' />
            </IconWithBlur>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.35)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {/* Tab for Home */}

      <Tabs.Screen 
        name="home" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Home',
          headerTitle: 'City Fit',
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
            <Feather name="user" size={size} color={color} />
          ),
          tabBarLabel: 'Profile',
          headerTitle: 'My Profile',
          headerTitleStyle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '500',
          },
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 12 }}
              onPress={() => router.push('/(drawer)/settings')}
            >
              <IconWithBlur>
                <Feather name="settings" size={24} color="#fff" />
              </IconWithBlur>
            </TouchableOpacity>
          ),
        }} 
      />
    </Tabs>
  );
}
