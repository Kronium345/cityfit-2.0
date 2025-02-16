import { StyleSheet, Text, View, FlatList, Button, Modal, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import FoodListItem from '../../components/FoodListItem';
import axios from 'axios';
import { useAuthContext } from '../AuthProvider';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';

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


const foodDetails = () => {
  const [foodLogs, setFoodLogs] = useState([]); // To store food logs for today
  const [totalCalories, setTotalCalories] = useState(0);
  const { user } = useAuthContext();  // Dynamically getting user from AuthContext
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const router = useRouter();

  // Log user data to confirm it's available
  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      fetchFoodLogs();
    }
  }, [user]);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const fetchFoodLogs = async () => {
    if (!user) {
      console.log("No user data available");
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
      const response = await axios.get(`http://localhost:5000/food/log/${user._id}?date=${today}`);
      setFoodLogs(response.data);
      const totalKcal = response.data.reduce((sum, item) => sum + item.cal, 0);
      setTotalCalories(totalKcal); // Set total calories for the day
      console.log("Food logs fetched:", response.data);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    }
  };
  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Food Tracker</Text>
          <View style={styles.headerRight} />
        </View>
        {/* Screen Header End */}

        <View style={styles.headerRow}>
          <Text style={styles.subTitle}>Calories</Text>
          <Text>{totalCalories} kcal</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.subTitle}>Today's Food</Text>
          <Link href="/foodHomeScreen" asChild>
            <Button title="Add Food" />
          </Link>
        </View>
        <FlatList
          data={foodLogs}
          contentContainerStyle={{ gap: 5 }}
          renderItem={({ item }) => (
            <FoodListItem item={item} onAddFood={() => handleAddFood(item)} showAddButton={false} />  // Pass the entire item object to the FoodListItem component
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </LinearGradient>


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


export default foodDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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






  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    color: "dimgray"
  }
});
