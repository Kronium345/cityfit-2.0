import { Tabs } from 'expo-router'; // Import Link from expo-router
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; // For tab icons
import { DrawerToggleButton } from '@react-navigation/drawer'; // For drawer toggle button
import { useRouter } from 'expo-router'; // For navigation
import React, { ReactNode, useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

// Nav Bar Tab Icons Start
const tabIcons = {
  more: {
    active: require('@/assets/icons/more-tab.png'),
    default: require('@/assets/icons/more-tab.png')
  },
  trainer: {
    active: require('@/assets/icons/trainer-tab.png'),
    default: require('@/assets/icons/trainer-tab.png')
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
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  // Add these animation values
  const fadeAnims = [
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
    React.useRef(new Animated.Value(0)).current,
  ];
  const scaleAnims = fadeAnims.map(() => React.useRef(new Animated.Value(0.1)).current);

  // Add this function to handle the animation
  const animateItems = React.useCallback(() => {
    // Reset animations
    fadeAnims.forEach(anim => anim.setValue(0));
    scaleAnims.forEach(anim => anim.setValue(0.1));

    // Create staggered animations
    const animations = fadeAnims.map((fadeAnim, index) => {
      const scaleAnim = scaleAnims[index];
      return Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          delay: index * 60, // Slightly longer delay for more distinct popping
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4, // Lower friction for more bounce
          tension: 40, // Adjust tension for pop speed
          useNativeDriver: true,
          delay: index * 60,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  }, []);

  // Modal Animation Trigger
  React.useEffect(() => {
    if (isMoreModalVisible) {
      animateItems();
    }
  }, [isMoreModalVisible]);

  // Modify the More Modal content to use Animated.View
  const ModalItem = ({ index, onPress, icon, text }) => (
    <Animated.View style={{
      opacity: fadeAnims[index],
      transform: [{ scale: scaleAnims[index] }],
      width: '48%', // Control individual item width relative to grid
    }}>
      <TouchableOpacity
        style={[styles.modalItem, { width: 140 }]} // Fixed width for each item
        onPress={onPress}
      >
        <Image
          source={icon}
          style={styles.modalIcon}
          resizeMode="contain"
        />
        <Text style={styles.modalText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
  

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


  // AI Chat History Modal Start
  const HistoryModal = ({ isVisible, onClose }) => {
    return (
      <Modal
        transparent
        visible={isVisible}
        onRequestClose={onClose}
        animationType="slide"
      >
        <View style={styles.historyModalContainer}>
          <View style={styles.historyModalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Feather name="x" size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <Text style={styles.historyModalTitle}>Chat History</Text>
            <Text style={styles.historyModalSubtitle}>View your previous conversations</Text>
            
            <ScrollView style={styles.historyList}>
              {chatHistory.map((chat, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    {typeof chat === 'string' ? chat : chat.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  // AI Chat History Modal End


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
              if (!isMoreModalVisible) {
                setIsMoreModalVisible(true);
              }
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
                source={focused ? tabIcons.trainer.active : tabIcons.trainer.default}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                }}
                resizeMode="contain"
              />
            ),
            tabBarLabel: 'Trainer',
            headerTitle: 'AI Trainer',
            // History Modal Button
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={() => setIsHistoryModalVisible(true)}
              >
                <IconWithBlur>
                  <Feather name="clock" size={20} color="#fff" />
                </IconWithBlur>
              </TouchableOpacity>
            ),
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
          activeOpacity={1}
          onPress={() => setIsMoreModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalGrid}>
              {[
                { route: '/exercises', icon: require('@/assets/icons/exercises-tab.png'), text: 'Exercises' },
                { route: '/workout', icon: require('@/assets/icons/workout-tab.png'), text: 'Workout' },
                { route: '/mental', icon: require('@/assets/icons/mental-tab.png'), text: 'Mental' },
                { route: '/foodScreen', icon: require('@/assets/icons/food-tracker-tab.png'), text: 'Food Tracker' },
                { route: '/settings', icon: tabIcons.settings, text: 'Settings' }
              ].map((item, index) => (
                <ModalItem
                  key={index}
                  index={index}
                  onPress={() => {
                    setIsMoreModalVisible(false);
                    // Add a small delay to ensure the modal closes before navigation
                    setTimeout(() => {
                      router.push(item.route);
                    }, 100);
                  }}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* More Modal End */}

      <HistoryModal
        isVisible={isHistoryModalVisible}
        onClose={() => setIsHistoryModalVisible(false)}
      />

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
    alignItems: 'center',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 14,
    width: '90%',
  },
  modalItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 12px rgba(0, 0, 0, 1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(4px)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 'auto',
    display: 'flex',
    justifyContent: 'center',
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

  // AI Chat History Modal Start
  historyModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  historyModalContent: {
    backgroundColor: '#003300',
    borderRadius: 24,
    padding: 24,
    margin: 16,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 26,
    height: 26,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  historyModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  historyModalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  historyList: {
    maxHeight: '70%',
  },
  historyItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyText: {
    color: '#fff',
    fontSize: 14,
  },
  // AI Chat History Modal End
});

