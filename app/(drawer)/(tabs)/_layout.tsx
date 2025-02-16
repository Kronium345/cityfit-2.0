import { Tabs } from 'expo-router'; // Import Link from expo-router
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; // For tab icons
import { DrawerToggleButton } from '@react-navigation/drawer'; // For drawer toggle button
import { useRouter } from 'expo-router'; // For navigation
import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

// Nav Bar Tab Icons Start
const tabIcons = {
  more: {
    active: require('@/assets/icons/more-tab.png'),
    default: require('@/assets/icons/more-tab.png')
  },
  plan: {
    active: require('@/assets/icons/plan-tab.png'),
    default: require('@/assets/icons/plan-tab.png')
  },
  home: {
    active: require('@/assets/icons/home-tab.png'),
    default: require('@/assets/icons/home-tab.png')
  },
  steps: {
    active: require('@/assets/icons/steps-tab.png'),
    default: require('@/assets/icons/steps-tab.png')
  },
  profile: {
    active: require('@/assets/icons/profile-tab.png'),
    default: require('@/assets/icons/profile-tab.png')
  },
  settings: require('@/assets/icons/settings-tab.png')
};
// Nav Bar Tab Icons End

export default function _layout() {
  const router = useRouter();  // Set up router for navigation
  const [isMoreModalVisible, setIsMoreModalVisible] = React.useState(false);

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
    <>
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
        {/* More Tab Start */}
        <Tabs.Screen
          name="more"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={focused ? tabIcons.more.active : tabIcons.more.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
            tabBarLabel: 'More',
            headerTitle: 'More',
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsMoreModalVisible(true);
            },
          }}
        />
        {/* More Tab End */}


        {/* PlanScreen Tab Start */}
        <Tabs.Screen
          name="planScreen"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={focused ? tabIcons.plan.active : tabIcons.plan.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
            tabBarLabel: 'Plan',
            headerTitle: 'Plan',
          }}
        />
        {/* PlanScreen Tab End */}


        {/* Home Tab Start */}
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={focused ? tabIcons.home.active : tabIcons.home.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
            tabBarLabel: 'Home',
            headerTitle: 'City Fit',
          }}
        />
        {/* Home Tab End */}


        {/* Step Counter Tab Start */}
        <Tabs.Screen
          name="stepCounter"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={focused ? tabIcons.steps.active : tabIcons.steps.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
            tabBarLabel: 'Steps',
            headerTitle: '',
          }}
        />
        {/* Step Counter Tab End */}


        {/* ProfileScreen Tab Start */}
        <Tabs.Screen
          name="profileScreen"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={focused ? tabIcons.profile.active : tabIcons.profile.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
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
                  <Image
                    source={tabIcons.settings}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: '#fff',
                    }}
                    resizeMode="contain"
                  />
                </IconWithBlur>
              </TouchableOpacity>
            ),
          }}
        />
        {/* ProfileScreen Tab End */}
      </Tabs>

      {/* More Modal Start */}
      <Modal
        visible={isMoreModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMoreModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setIsMoreModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalGrid}>
              {/* Exercise Page Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/exercises');
                  setIsMoreModalVisible(false);
                }}
              >
                <Image
                  source={require('@/assets/icons/exercises-tab.png')}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalText}>Exercises</Text>
              </TouchableOpacity>
              {/* Exercise Page End */}

              {/* Workout Button Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/workout');
                  setIsMoreModalVisible(false);
                }}
              >
                <Image
                  source={require('@/assets/icons/workout-tab.png')}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalText}>Workout</Text>
              </TouchableOpacity>
              {/* Workout Button End */}

              {/* Mental Button Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/mental');
                  setIsMoreModalVisible(false);
                }}
              >
                <Image
                  source={require('@/assets/icons/mental-tab.png')}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalText}>Mental</Text>
              </TouchableOpacity>
              {/* Mental Button End */}

              {/* Food Tracker Button Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/foodScreen');
                  setIsMoreModalVisible(false);
                }}
              >
                <Image
                  source={require('@/assets/icons/food-tracker-tab.png')}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalText}>Food Tracker</Text>
              </TouchableOpacity>
              {/* Food Tracker Button End */}

              {/* Settings Button Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/settings');
                  setIsMoreModalVisible(false);
                }}
              >
                <Image
                  source={tabIcons.settings}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
                <Text style={styles.modalText}>Settings</Text>
              </TouchableOpacity>
              {/* Settings Button End */}
            </View>
          </View>

        </TouchableOpacity>
      </Modal>
      {/* More Modal End */}

    </>
  );
}


const styles = StyleSheet.create({
  // More Modal Start
  modalContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: "none",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    marginHorizontal: 10,
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  modalItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 12px rgba(0, 0, 0, 1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(4px)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  modalIcon: {
    width: 26,
    height: 26,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontWeight: '500',
  },
  // More Modal End
});

