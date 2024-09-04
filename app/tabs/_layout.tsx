import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="planScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus" size={size} color={color} />
          ),
          title: 'Plan',
        }}
      />
      <Tabs.Screen
        name="chartScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="line-chart" size={size} color={color} />
          ),
          title: 'Charts',
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
          title: 'Profile',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
