import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Button, Modal, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useAuthContext } from '../AuthProvider';
import Toast from 'react-native-toast-message';


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


const { width } = Dimensions.get('window');

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

export default function Exercises() {
  const [exercises, setExercises] = useState([]); // All exercises
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);  // To show loading spinner when fetching
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(null);  // Store the offset for pagination
  const pageSize = 10; // 10 items per page
  const router = useRouter();
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState([]); // Track the favorite exercises


  useEffect(() => {
    fetchExercises();
  }, [page]);

  const fetchExercises = async () => {
    setLoading(true); // Start loading
    try {
      const params = {
        pageSize: pageSize, // Set the page size
        ...(offset && { offset }), // Use the offset if available
      };

      // Fetching exercises data from Airtable
      const response = await axios.get(
        `https://api.airtable.com/v0/${process.env.EXPO_PUBLIC_AIRTABLE_BASE_ID}/${process.env.EXPO_PUBLIC_AIRTABLE_TABLE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_AIRTABLE_PAT}`,
          },
          params: params,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.records) {
        // Log the results to check what they look like
        console.log("Full Results:", response.data.records);

        // Set exercises directly without filtering
        setExercises(prevExercises => [...prevExercises, ...response.data.records]);  // Add the new exercises

        // Update offset if available
        setOffset(response.data.offset);
      } else {
        console.log("No results found in the API response.");
      }
    } catch (error) {
      console.error("Fetching exercises failed:", error);
    } finally {
      setLoading(false);  // End loading
    }
  };

  const handleSearch = text => {
    setSearchTerm(text);
  };

  // Toast Pop-Ups
  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };
  

  const handleSelectExercise = (exercise) => {
    router.push({
      pathname: '/exerciseDetails',
      params: {
        id: exercise.id,
        name: exercise.fields.Exercise,  // Assuming 'Exercise' is the field for exercise names
        description: exercise.fields.Notes || 'No description available',
        image: exercise.fields.Example ? exercise.fields.Example[0].url : null,  // Access the URL directly
        equipment: exercise.fields.Equipment || 'Not specified', // Exercise equipment
        exerciseType: exercise.fields['Exercise Type'] || 'Not specified',  // Exercise type
        majorMuscle: exercise.fields['Major Muscle'] || 'Not specified',  // Major muscle
        minorMuscle: exercise.fields['Minor Muscle'] || 'Not specified',  // Minor muscle
        modifications: exercise.fields.Modifications || 'No modifications available',
      }
    });
  };

  // Exercise Filtering Search Start
  const searchFilteredExercises = exercises.filter(exercise =>
    exercise.fields.Exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Exercise Filtering Search End
  

  // Favorite Toggle Logic Start
  const handleToggleFavorite = async (exerciseId) => {
    if (!user || !exerciseId) {
      showToast('error', 'Favorite Toggle Failed', 'User not logged in or Invalid Exercise');
      return;
    }
  
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) {
      showToast('error', 'Exercise not found', 'Unable to find exercise');
      return;
    }
  
    const exerciseName = exercise.fields?.Exercise;
    if (!exerciseName) {
      showToast('error', 'Exercise name not available', 'Unable to find exercise name');
      return;
    }
  
    const logEntry = {
      userId: user._id,
      exerciseName: exerciseName,
      isFavorite: !exercise.isFavorite, // Toggle favorite status
    };
  
    try {
      // Post to server to toggle favorite status
      await axios.post('http://localhost:5000/history/toggle-favorite', logEntry);
  
      // Update the favorite status locally
      setExercises(prevExercises => prevExercises.map(ex =>
        ex.id === exerciseId ? { ...ex, isFavorite: !ex.isFavorite } : ex
      ));
  
      showToast('success', 'Favorite Status Updated', 'Exercise favorite status has been toggled.');
    } catch (error) {
      console.error('Error toggling favorite:', error.response ? error.response.data : error.message);
      showToast('error', 'Favorite Toggle Failed', 'Error occurred while toggling favorite.');
    }
  };
  
  
  

  useEffect(() => {
    if (user && activeTab === 'Favorites') {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/history/favorites/${user._id}`);
          const favoriteNames = response.data.map(fav => fav.exerciseName); // Extract the favorite exercise names
          
          // Update exercises based on the fetched favorites
          const updatedExercises = exercises.map(exercise => ({
            ...exercise,
            isFavorite: favoriteNames.includes(exercise.fields?.Exercise),
          }));
          setExercises(updatedExercises);  // Update the exercises state with the favorite status
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [user, activeTab]);  // Fetch favorites only when the user or activeTab changes
  // Favorite Toggle Logic End


  // Tab Filtering Logic Start
  const getFilteredExercises = () => {
    switch (activeTab) {
      case 'Favorites':
        return searchFilteredExercises.filter(exercise => exercise.isFavorite);
      case 'Muscles':
        return [];
      default:
        return searchFilteredExercises;
    }
  };
  // Tab Filtering Logic End


  // useEffect(() => {
  //   if (user && activeTab === 'Favorites') {
  //     const fetchFavorites = async () => {
  //       try {
  //         const response = await axios.get(`http://localhost:5000/history/favorites/${user._id}`);
  //         setFavorites(response.data);  // Set the fetched favorites
  //       } catch (error) {
  //         console.error('Error fetching favorites:', error);
  //       }
  //     };
      
  //     fetchFavorites();  // Fetch favorites on tab change
  //   }
  // }, [user, activeTab]);  // Re-fetch only when user or activeTab changes
  

  return (
    <View style={styles.container}>
      <BlobBackground />
      {/* Screen Header Start */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconWithBlur>
            <DrawerToggleButton tintColor='#fff' />
          </IconWithBlur>
        </View>
        <Text style={styles.headerTitle}>Exercises</Text>
        <View style={styles.headerRight} />
      </View>
      {/* Screen Header End */}

      <View style={styles.contentContainer}>
        {/* Search Bar Start */}
        <View style={styles.searchBarContainer}>
          <Feather
            name="search"
            size={18}
            color="rgba(255, 255, 255, 0.6)"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            style={styles.searchBar}
            onChangeText={handleSearch}
            value={searchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchTerm('')}
              style={styles.clearButton}
            >
              <Feather
                name="x"
                size={18}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          )}
        </View>
        {/* Search Bar End */}


        {/* Tab Container Start */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'All' && styles.activeTab]}
            onPress={() => setActiveTab('All')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'All' && styles.activeTabText
            ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Favorites' && styles.activeTab]}
            onPress={() => setActiveTab('Favorites')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Favorites' && styles.activeTabText
            ]}>
              Favorites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Muscles' && styles.activeTab]}
            onPress={() => setActiveTab('Muscles')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'Muscles' && styles.activeTabText
            ]}>
              Muscles
            </Text>
          </TouchableOpacity>
        </View>
        {/* Tab Container End */}


        {/* Main Component Start */}
        {activeTab === 'Muscles' ? (
          // "Muscle" Component Start 
          <ScrollView style={styles.recentContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.sectionHeaderTitle}>TARGET YOUR TRAINING</Text>
              <Text style={styles.headerSubtitle}>
              Browse exercises by muscle group and build workouts that focus on your specific training goals
              </Text>
            </View>

            <View style={styles.muscleGrid}>
              {/* First Row */}
              <View style={styles.gridRow}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('chest')}
                >
                  <Image
                    source={require('../../assets/images/category/chest.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>CHEST</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('shoulders')}
                >
                  <Image
                    source={require('../../assets/images/category/shoulders.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>SHOULDERS</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Second Row */}
              <View style={styles.gridRow}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('back')}
                >
                  <Image
                    source={require('../../assets/images/category/back.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>BACK</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('arms')}
                >
                  <Image
                    source={require('../../assets/images/category/arms.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>ARMS</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Third Row */}
              <View style={styles.gridRow}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('core')}
                >
                  <Image
                    source={require('../../assets/images/category/core.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>CORE</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('legs')}
                >
                  <Image
                    source={require('../../assets/images/category/legs.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>LEGS</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Fourth Row */}
              <View style={styles.gridRow}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('glutes')}
                >
                  <Image
                    source={require('../../assets/images/category/glutes.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>GLUTES</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress('conventionals')}
                >
                  <Image
                    source={require('../../assets/images/category/conventional.webp')}
                    style={styles.categoryImage}
                  />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryText}>CONVENTIONALS</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          // "Muscle" Component End 
        ) : (

          // "All" & "Favorites" Component Start 
          <FlatList
            data={getFilteredExercises()}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const imageUrl = item.fields.Example && item.fields.Example[0] ? item.fields.Example[0].url : null;

              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleSelectExercise(item)}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <Text>No Image Available</Text>
                  )}
                  <Text style={styles.itemText}>{item.fields.Exercise}</Text>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleToggleFavorite(item.id)}
                  >
                    <Image
                      source={item.isFavorite
                        ? require('../../assets/icons/star-filled.png')
                        : require('../../assets/icons/star-outline.png')
                      }
                      style={styles.starIcon}

                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  {activeTab === 'Favorites'
                    ? 'No favorite exercises yet'
                    : 'No exercises found'}
                </Text>
              </View>
            )}
          />
          // "All" & "Favorites" Component End 
        )}
      </View>


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
}

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
  contentContainer: {
    flex: 1,
    paddingTop: 20,
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

  // Search Bar Start
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  // Search Bar End

  // Tab Component Start
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '400',
  },
  // Tab Component End

  // "All" & "Favorites" Component Start
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 6,
    position: 'relative',
  },
  thumbnail: {
    width: 65,
    height: 65,
    marginRight: 10,
    borderRadius: 14,
  },
  itemText: {
    fontSize: 18,
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    right: 6,
    top: 6,
    padding: 5,
  },
  starIcon: {
    width: 16,
    height: 16,
    tintColor: 'rgba(255, 255, 255, 0.6)',
  },
  
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
  // "All" & "Favorites" Component End

  // "Muscle" Component Start
  recentContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    width: '90%',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  muscleGrid: {
    padding: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '48%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  // "Muscle" Component End
});


const handleCategoryPress = (category) => {
  // Handle category selection here
  console.log(`Selected category: ${category}`);
  // You can filter exercises by category or navigate to a category-specific screen
};
