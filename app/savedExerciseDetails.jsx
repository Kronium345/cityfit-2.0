import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

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
  }
};
// Nav Bar Tab Icons End

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
  const blob1Animation = useSharedValue(0);
  const blob2Animation = useSharedValue(0);
  const blob3Animation = useSharedValue(0);

  useEffect(() => {
    const animate = (value, duration) => {
      'worklet';
      value.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    };

    animate(blob1Animation, 15000);
    animate(blob2Animation, 25000);
    animate(blob3Animation, 20000);
  }, []);

  const createBlobStyle = (animation) => {
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { scale: 1 + animation.value * 0.2 },
        { rotate: `${animation.value * 360}deg` },
      ],
      opacity: 0.7 + animation.value * 0.2,
    }));

    return animatedStyles;
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.backgroundContainer}>
        <AnimatedSvg style={[styles.blob, createBlobStyle(blob1Animation)]}>
          <Circle r={100} cx={100} cy={100} fill="rgba(7, 94, 7, 0.4)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob2, createBlobStyle(blob2Animation)]}>
          <Circle r={110} cx={110} cy={110} fill="rgba(6, 214, 37, 0.15)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob3, createBlobStyle(blob3Animation)]}>
          <Circle r={90} cx={90} cy={90} fill="rgba(0, 0, 0, 0.4)" />
        </AnimatedSvg>
      </View>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};
// Blob Blurred Background End

// Menu Icon Component Start
const IconWithBlur = ({ children, intensity = 20, style = {}, backgroundColor = 'rgba(0, 0, 0, 0.3)' }) => (
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
// Menu Icon Component End

const SavedExerciseDetails = () => {
  const router = useRouter();
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const { id, name, sets, reps, weight, date } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <BlobBackground />
      
      {/* Screen Header Start */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerLeft}
          onPress={() => router.push('/(drawer)/workout')}
        >
          <BlurView
            intensity={20}
            tint="light"
            style={styles.iconBlur}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise History</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Screen Header End */}

      {/* Main Content Start */}
      <View style={styles.content}>
        <Text style={styles.exerciseName}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Sets: {sets}</Text>
          <Text style={styles.statsText}>Reps: {reps}</Text>
          <Text style={styles.statsText}>Weight: {weight}kg</Text>
        </View>
      </View>
      {/* Main Content End */}

      {/* Custom Tab Bar Start */}
      <CustomTabBar setIsMoreModalVisible={setIsMoreModalVisible} />
      {/* Custom Tab Bar End */}

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

              {/* Workout Page Start */}
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
              {/* Workout Page End */}

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
                  source={require('@/assets/icons/settings-tab.png')}
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
    </View>
  );
};

// Custom Tab Bar Start
const CustomTabBar = ({ setIsMoreModalVisible }) => {
  const router = useRouter();

  return (
    <BlurView
      intensity={20}
      tint=""
      style={styles.tabBar}
    >
      <TouchableOpacity
        style={styles.tabItem}
        onPress={(e) => {
          e.preventDefault();
          setIsMoreModalVisible(true);
        }}
      >
        <Image 
          source={tabIcons.more.active}
          style={{
            width: 25,
            height: 25,
            tintColor: '#fff'
          }}
          resizeMode="contain"
        />
        <Text style={[styles.tabLabel, styles.activeTab]}>More</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/planScreen')}
      >
        <Image 
          source={tabIcons.trainer.default}
          style={{
            width: 25,
            height: 25,
            tintColor: 'rgba(255, 255, 255, 0.6)'
          }}
          resizeMode="contain"
        />
        <Text style={styles.tabLabel}>Trainer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/home')}
      >
        <Image 
          source={tabIcons.home.default}
          style={{
            width: 24,
            height: 24,
            tintColor: 'rgba(255, 255, 255, 0.6)'
          }}
          resizeMode="contain"
        />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/stepCounter')}
      >
        <Image 
          source={tabIcons.steps.default}
          style={{
            width: 25,
            height: 25,
            tintColor: 'rgba(255, 255, 255, 0.6)'
          }}
          resizeMode="contain"
        />
        <Text style={styles.tabLabel}>Steps</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/profileScreen')}
      >
        <Image 
          source={tabIcons.profile.default}
          style={{
            width: 25,
            height: 25,
            tintColor: 'rgba(255, 255, 255, 0.6)'
          }}
          resizeMode="contain"
        />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </BlurView>
  );
};
// Custom Tab Bar End

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 0, 1)',
  },
  // Blob Blurred Background Start
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: '10%',
    top: '20%',
  },
  blob2: {
    left: '60%',
    top: '45%',
  },
  blob3: {
    left: '30%',
    top: '70%',
  },
  // Blob Blurred Background End

  // Screen Header Start
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  iconBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Screen Header End

  // Content Styles Start
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
  },
  statsText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  // Content Styles End

  // Nav Bar Start
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    elevation: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
  },
  tabLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTab: {
    color: '#fff',
  },
  // Nav Bar End

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

export default SavedExerciseDetails;
