import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Image, Dimensions, View, Modal, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useAuthContext } from '../app/AuthProvider';
import NewSetInput from '../components/NewSetInput';
import Toast from 'react-native-toast-message';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

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


const { width: screenWidth } = Dimensions.get('window');


// Set Tracker Component Start
const SetTracker = ({ onLogExercise }) => {
  const [sets, setSets] = useState([1]);
  const [setData, setSetData] = useState({
    1: { rest: '0s', weight: '0', reps: '0' }
  });
  const [completedSets, setCompletedSets] = useState(new Set());

  const addSet = () => {
    const newSetNumber = sets.length + 1;
    setSets([...sets, newSetNumber]);
    setSetData(prev => ({
      ...prev,
      [newSetNumber]: { rest: '0s', weight: '0', reps: '0' }
    }));
  };

  const handleComplete = (setNumber) => {
    setCompletedSets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(setNumber)) {
        newSet.delete(setNumber);
      } else {
        newSet.add(setNumber);
      }
      return newSet;
    });
  };

  const removeLastSet = () => {
    if (sets.length > 1) {
      const newSets = sets.slice(0, -1);
      setSets(newSets);
      const { [sets.length]: _, ...newSetData } = setData;
      setSetData(newSetData);
    }
  };

  const updateSetValue = (setNumber, field, value) => {
    setSetData(prev => ({
      ...prev,
      [setNumber]: {
        ...prev[setNumber],
        [field]: value
      }
    }));
  };

  // Calculate totals and log exercise
  const handleLogExercise = () => {
    const totalSets = sets.length;
    const avgReps = Math.round(
      Object.values(setData).reduce((sum, set) => sum + parseInt(set.reps || 0, 10), 0) / totalSets
    );
    const avgWeight = parseFloat(
      (Object.values(setData).reduce((sum, set) => sum + parseFloat(set.weight || 0), 0) / totalSets).toFixed(2)
    );

    onLogExercise(totalSets, avgReps, avgWeight);
  };

  return (
    <View style={styles.setTrackerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.columnHeader, styles.setColumn]}>SET</Text>
        <Text style={[styles.columnHeader, styles.restColumn]}>REST</Text>
        <Text style={[styles.columnHeader, styles.kgColumn]}>KG</Text>
        <Text style={[styles.columnHeader, styles.repsColumn]}>REPS</Text>
        <View style={[styles.columnHeader, styles.checkColumn]}>
          <Ionicons
            name="checkmark"
            size={18}
            color="rgba(255, 255, 255, 0.4)"
          />
        </View>
      </View>

      {sets.map((setNumber) => (
        <View key={setNumber} style={styles.setRow}>
          <Text style={[styles.setText, styles.setColumn]}>{setNumber}</Text>
          <TextInput
            style={[styles.setInput, styles.restColumn]}
            keyboardType="numeric"
            value={setData[setNumber]?.rest}
            onChangeText={(value) => updateSetValue(setNumber, 'rest', value)}
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.setInput, styles.kgColumn]}
            keyboardType="numeric"
            value={setData[setNumber]?.weight}
            onChangeText={(value) => updateSetValue(setNumber, 'weight', value)}
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.setInput, styles.repsColumn]}
            keyboardType="numeric"
            value={setData[setNumber]?.reps}
            onChangeText={(value) => updateSetValue(setNumber, 'reps', value)}
            placeholderTextColor="#666"
          />
          <Pressable
            style={[styles.checkButton, styles.checkColumn, completedSets.has(setNumber) && styles.checkButtonCompleted]}
            onPress={() => handleComplete(setNumber)}
          >
            <Ionicons
              name="checkmark"
              size={18}
              color={completedSets.has(setNumber) ? "#fff" : "rgba(255, 255, 255, 0.4)"}
            />
          </Pressable>
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={addSet}
        >
          <Text style={styles.addSetButton}>+ Add Set</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={removeLastSet}
        >
          <Text style={styles.removeSetButton}>Remove Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// Set Tracker Component End

const ExerciseDetail = () => {
  const router = useRouter();
  // Use useLocalSearchParams to access route parameters
  const { id, name, description, image, equipment, exerciseType, majorMuscle, minorMuscle, modifications } = useLocalSearchParams();
  const { user } = useAuthContext();
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Details');

  // Ensure the id exists before proceeding
  if (!id) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.titleNo}>Exercise details unavailable</Text>
      </ScrollView>
    );
  }

  // ExerciseId is passed through the URL from the exercises.jsx component
  const exerciseId = id;

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const handleLogExercise = async (sets, reps, weight) => {
    if (!user || !name) {  // Use name from localSearchParams instead of exerciseId
      showToast('error', 'Exercise Logging Failed', 'User not logged in or Exercise name is invalid');
      return;
    }

    const logEntry = {
      userId: user._id,
      exerciseName: name,  // Pass exercise name instead of exerciseId
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
    };

    try {
      const response = await axios.post(`https://fitness-one-server.onrender.com/history/history`, logEntry);
      console.log('Exercise logged:', response.data);
      showToast('success', 'Exercise Logged Successfully', 'Your exercise has been logged.');
    } catch (error) {
      console.error('Error logging exercise:', error.response ? error.response.data : error.message);
      showToast('error', 'Exercise Logging Failed', 'Error occurred while logging exercise.');
    }
  };


  return (
    <View style={styles.container}>
      <BlobBackground />

      {/* Header Start */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name || 'Exercise Details'}</Text>
      </View>
      {/* Header End */}

      {/* Tabs Component Start */}
      <View style={styles.tabsContainer}>
        {['Details', 'Tutorial', 'Workouts'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Tabs Component End */}

      {/* Main Component (Scrollable Content) Start */}
      <ScrollView style={styles.scrollContent}>
        {activeTab === 'Details' && (
          <>
            <Image source={{ uri: image }} style={styles.exercisePreview} />
            <Text style={styles.description}>{description || 'No description available.'}</Text>

            {/* Exercise Details Start */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}><Ionicons name="information-circle-outline" size={20} color="rgba(255, 255, 255, 0.7)" />{name || 'Exercise Details'}</Text>
              <Text style={styles.detailText}>Equipment: {equipment || 'Not specified'}</Text>
              <Text style={styles.detailText}>Exercise Type: {exerciseType || 'Not specified'}</Text>
              <Text style={styles.detailText}>Major Muscle: {majorMuscle || 'Not specified'}</Text>
              <Text style={styles.detailText}>Minor Muscle: {minorMuscle || 'Not specified'}</Text>
              <Text style={styles.detailText}>Modifications to Help: {modifications || 'Not specified'}</Text>
            </View>
            {/* Exercise Details End */}

            {/* Set Tracker Component Start */}
            <SetTracker onLogExercise={handleLogExercise} />
            {/* Set Tracker Component End */}

            {/* Log Exercise Button Start */}
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogExercise}
            >
              <Text style={styles.logButtonText}>Log Exercise</Text>
            </TouchableOpacity>
            {/* Log Exercise Button End */}
          </>
        )}

        {activeTab === 'Tutorial' && (
          <View style={styles.emptyTabContainer}>
            {/* TODO: Add Tutorial Content
              Suggested content:
              - Video player component
              - Step-by-step instructions
              - Form tips
              - Common mistakes to avoid
            */}
            <Text style={styles.emptyTabText}>Tutorial content coming soon</Text>
          </View>
        )}

        {activeTab === 'Workouts' && (
          <View style={styles.emptyTabContainer}>
            {/* TODO: Add Workouts Content
              Suggested content:
              - List of workouts featuring this exercise
              - Recommended workout combinations
              - Training programs
              - User-created workouts
            */}
            <Text style={styles.emptyTabText}>Workouts content coming soon</Text>
          </View>
        )}
      </ScrollView>
      {/* Main Component (Scrollable Content) End */}


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

  // Header Start
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    position: 'relative',
    backgroundColor: 'rgba(0, 26, 0, 1)',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 400,
    color: '#fff',
    textShadow: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    textAlign: 'center',
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Header End

  // Tabs Component Start
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  emptyTabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyTabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    textAlign: 'center',
  },
  // Tabs Component End

  // Exercise Details Start
  titleNo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exercisePreview: {
    width: screenWidth - 40,
    height: (screenWidth) * 0.5625,
    marginTop: 12,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  detailsContainer: {
    marginHorizontal: 16,
  },
  detailsTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  // Exercise Details End

  // Set Tracker Component Start
  setTrackerContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  columnHeader: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'center',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  setColumn: {
    width: 40,
  },
  restColumn: {
    width: 60,
  },
  kgColumn: {
    width: 60,
  },
  repsColumn: {
    width: 60,
  },
  checkColumn: {
    width: 40,
  },
  setText: {
    color: '#fff',
    textAlign: 'center',
  },
  setInput: {
    color: '#fff',
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
  },
  checkButton: {
    alignItems: 'center',
    padding: 0,
  },
  checkButtonCompleted: {
    backgroundColor: '#075E07',
    borderRadius: 40,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  addButton: {
    backgroundColor: '#222',
  },
  addSetButton: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  removeSetButton: {
    color: '#ff4444',
    fontWeight: 600,
    textAlign: 'center',
    fontSize: 16,
  },
  logButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 160,
  },
  logButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
  },
  // Set Tracker Component End
});

export default ExerciseDetail;
