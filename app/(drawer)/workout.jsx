import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useAuthContext } from '../AuthProvider';
import resistanceIcon from "../../assets/tracker-images/resistance.png"; // Updated path
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;


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


const workout = () => {
  const [historyData, setHistoryData] = useState([]);
  const { user } = useAuthContext();
  const router = useRouter();
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('User ID not found');
      return;
    }
    console.log('Fetching history for user:', user._id);
    fetchExerciseHistory();  // Fetch data on mount
  }, [user]);

  // Fetch the exercise history
  const fetchExerciseHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/exercise/${user._id}`);
      console.log('Fetched history:', response.data);
      
      if (response.data) {
        const updatedHistory = response.data.map((entry) => {
          return {
            date: new Date(entry.dateLogged).toLocaleString(),
            exerciseName: entry.exerciseName,
            weight: entry.weight,
            sets: entry.sets,
            reps: entry.reps,
            detail: `${entry.weight} kg, ${entry.sets} sets, ${entry.reps} reps`
          };
        });
        setHistoryData(updatedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch exercise history:', error);
    }
  };


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


  return (
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Screen Header Start */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconWithBlur>
            <DrawerToggleButton tintColor='#fff' />
          </IconWithBlur>
        </View>
        <Text style={styles.headerTitle}>Workouts</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Screen Header End */}

      <ScrollView style={[styles.mainContainer, { backgroundColor: 'transparent' }]}>

        {historyData.length ? (
          <View style={styles.historyList}>
            {historyData.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.dateWrapper}>
                  <Text style={styles.date}>{item.date}</Text>
                </View>

                <View style={styles.exerciseWrapper}>
                  <Image
                    source={resistanceIcon} // Always using resistance icon
                    style={styles.icon}
                  />
                  <View>
                    <Text style={styles.exerciseName}>{item.exerciseName}</Text>
                    <Text style={styles.exerciseDetail}>{item.detail}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>No exercise history available.</Text>
        )}
      </ScrollView>

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

    </LinearGradient>
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
  mainContainer: {
    paddingHorizontal: 10,
  },

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
  contentContainer: {
    flex: 1,
    paddingTop: 0,
  },
  // Screen Header End

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


  historyList: {
    marginTop: 20,
  },
  historyItem: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  dateWrapper: {
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#555',
  },
});

export default workout;
