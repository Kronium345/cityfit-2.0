import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Expo Image Picker
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

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


const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState(''); // State to hold the avatar URL
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('calendar'); // Add this state

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log("Fetched user data:", response.data);  // Log the fetched data
          setUserData(response.data);
          setWeight(response.data.weight || '');
          setExperience(response.data.experience || '');
          setGender(response.data.gender || '');

          // Check if avatar exists, and format it properly
          if (response.data.avatar) {
            setAvatar(`http://localhost:5000/${response.data.avatar.replace(/\\/g, '/')}`);
          } else {
            setAvatar('');  // Default to empty if no avatar
          }

          // Log avatar to verify
          console.log("User avatar path:", response.data.avatar);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');
    try {
      const updatedData = { weight, experience, gender };
      const response = await axios.put(`http://localhost:5000/user/${user._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setEditing(false);
      setAvatar(response.data.avatar); // Update avatar after saving changes

      // Log updated avatar
      console.log("Updated avatar path:", response.data.avatar);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle selecting an image from the device
  const pickImage = async () => {
    try {
      // Request permissions to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to access your photos.');
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],  // Ensure it's properly set
        allowsEditing: true,
        aspect: [1, 1],  // Ensuring a square crop
        quality: 1,  // High quality
      });

      // Check if the user selected a file (not canceled)
      if (!result.canceled) {
        console.log('Image selected:', result);

        const imageUri = result.assets[0].uri; // Get URI of selected image
        setAvatar(imageUri);  // Set avatar URL with the new selected image URI
        uploadImage(imageUri);  // Call the upload function
      } else {
        console.log('Image selection was canceled');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  // Handle uploading the selected image
  const uploadImage = async (uri) => {
    // setLoadingImage(true); // Show loading spinner while uploading

    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const token = await AsyncStorage.getItem('token');

    // Set file type based on URI
    const fileType = uri.split('.').pop() === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('avatar', {
      uri: uri,  // URI of the image selected
      type: fileType, // Dynamically set MIME type
      name: `avatar.${fileType === 'image/png' ? 'png' : 'jpg'}`, // Set file name with appropriate extension
    });

    try {
      // Sending the image file to the backend using PUT request
      const response = await axios.put(
        `http://localhost:5000/user/${user._id}/avatar`,  // Your backend endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',  // Ensure correct content type
          },
        }
      );

      console.log('Image uploaded successfully:', response.data);
      setAvatar(response.data.avatar);  // Set the updated avatar from the response
      Alert.alert('Success', 'Your profile image has been updated!');
      // No navigation to weightInput screen as you requested
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload your profile picture. Please try again.');
    } finally {
      // setLoadingImage(false);  // Hide loading spinner
    }
  };

  // Calendar Component Start
  const renderCalendar = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = getDay(start);
    const emptyDays = Array(firstDayOfWeek).fill(null);
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDate = today.getDate();

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>{format(today, 'MMMM yyyy')}</Text>

        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {emptyDays.map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}
          {days.map((date) => {
            const isToday = date.getDate() === currentDate;
            return (
              <View key={date.toString()} style={styles.dayCell}>
                <View style={[styles.dayWrapper, isToday && styles.todayWrapper]}>
                  <Text style={[styles.dayText, isToday && styles.todayText]}>
                    {format(date, 'd')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  // Calendar Component End

  // Tab Content Components
  const renderCalendarTab = () => {
    return (
      <View style={styles.DataBox}>
        {renderCalendar()}
      </View>
    );
  };

  const renderMeasurementsTab = () => {
    return (
      <View style={styles.DataBox}>
        {/* TODO: Add your recipes content here
          Suggested components:
          - Weight tracking graph
          - Body recipes input/display
          - Progress photos
          - BMI calculator
        */}
        <MaterialCommunityIcons name="chart-line" size={40} color="rgba(255, 255, 255, 0.55)" />
        <Text style={styles.noDataText}>No recipes recorded yet</Text>
      </View>
    );
  };

  // Steps Tab Component Start
  const renderStepsTab = () => {
    const totalSteps = 10900; // Replace with actual total steps from your data
    const formattedSteps = (totalSteps / 1000).toFixed(1) + 'K';

    return (
      <View style={styles.stepsDataBox}>
        {/* Total Steps Progress Section */}
        <View style={styles.totalStepsContainer}>
          <View style={styles.totalStepsContent}>
            {/* Icon Container */}
            <View style={styles.iconContainer}>
              <Feather name="pie-chart" size={26} color="#fff" />
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <Text style={styles.totalStepsTitle}>Total Steps Tracked</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '85%' }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.currentSteps}>{formattedSteps}</Text>
                  <Text style={styles.rankText}>Top 1%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Existing Achievements Section */}
        <TouchableOpacity
          style={styles.stepsAchievementsContainer}
          onPress={() => router.push({
            pathname: '/(drawer)/stepHistory',
            params: { initialTab: 'achievements' }
          })}
        >
          <View style={styles.stepsTitleContainer}>
            <Text style={styles.stepsAchievementTitle}>Steps Achievements</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.75)" />
          </View>
          <View style={styles.badgesContainer}>
            <View style={styles.badgeItem}>
              <View style={styles.badge}>
                <View style={styles.badgeTextContainer}>
                  <Text style={styles.badgeNumber}>10</Text>
                  <Text style={styles.badgeUnit}>K</Text>
                </View>
              </View>
              <Text style={styles.badgeLabel}>10K steps</Text>
            </View>

            <View style={styles.badgeItem}>
              <View style={styles.badge}>
                <View style={styles.badgeTextContainer}>
                  <Text style={styles.badgeNumber}>50</Text>
                  <Text style={styles.badgeUnit}>K</Text>
                </View>
              </View>
              <Text style={styles.badgeLabel}>50K steps</Text>
            </View>

            <View style={styles.badgeItem}>
              <View style={styles.badge}>
                <View style={styles.badgeTextContainer}>
                  <Text style={styles.badgeNumber}>75</Text>
                  <Text style={styles.badgeUnit}>K</Text>
                </View>
              </View>
              <Text style={styles.badgeLabel}>75K steps</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // Steps Tab Component End

  // Exercises Tab Component Start
  const renderExercisesTab = () => {
    return (
      <View style={styles.DataBox}>
        {/* TODO: Add your exercises content here
          Suggested components:
          - Exercise history
          - Personal records
          - Favorite exercises
          - Exercise statistics
        */}
        <MaterialCommunityIcons name="chart-line" size={40} color="rgba(255, 255, 255, 0.55)" />
        <Text style={styles.noDataText}>No exercise history yet</Text>
      </View>
    );
  };
  // Exercises Tab Component End

  // Main render function for tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'calendar':
        return renderCalendarTab();
      case 'exercises':
        return renderExercisesTab();
      case 'recipes':
        return renderMeasurementsTab();
      case 'steps':
        return renderStepsTab();
      default:
        return renderCalendarTab();
    }
  };

  return (
    <View style={styles.container}>
      <BlobBackground />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {avatar ? (
              <Image
                source={{
                  uri: avatar.includes('http')
                    ? avatar
                    : `http://localhost:5000/${avatar.replace(/\\/g, '/')}`
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('../../../assets/images/logo-img/person-icon.jpg')}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <Ionicons name="add-circle" size={24} color="rgba(0, 0, 0, 1)" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.firstName || ''}</Text>
            <Text style={styles.profileUsername}>@{userData.username || ''}<Ionicons name="copy-outline" size={14} color="rgba(255, 255, 255, 0.6)" /></Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>13</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
        </View>

        {/* Edit Profile Button Start*/}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push('/(drawer)/settings/profile')}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        {/* Edit Profile Button End*/}

        {/* Premium Promo Start*/}
        <TouchableOpacity style={styles.premiumPromoContainer}>
          <View style={styles.premiumPromoContent}>
            <View style={styles.premiumPromoTextContainer}>
              <Text style={styles.premiumPromoTitle}>Get the all in one experience</Text>
              <Text style={styles.premiumPromoSubtitle}>For less than a cup of coffee</Text>
            </View>
            <TouchableOpacity
              style={styles.tryPremiumButton}
              onPress={() => router.push('/(drawer)/settings/subscription')}
            >
              <Text style={styles.tryPremiumText}>Try Premium</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {/* Premium Promo End*/}

        {/* Icon Row Start*/}
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={[styles.iconButton, selectedTab === 'calendar' && styles.selectedIcon]}
            onPress={() => setSelectedTab('calendar')}
          >
            <View style={styles.iconContent}>
              <Ionicons name="calendar-outline" size={24} color={selectedTab === 'calendar' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.55)'} />
              {selectedTab === 'calendar' && <Text style={styles.iconText}>Calendar</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, selectedTab === 'steps' && styles.selectedIcon]}
            onPress={() => setSelectedTab('steps')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="shoe-print" size={24} color={selectedTab === 'steps' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.55)'} />
              {selectedTab === 'steps' && <Text style={styles.iconText}>Steps</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, selectedTab === 'exercises' && styles.selectedIcon]}
            onPress={() => setSelectedTab('exercises')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="dumbbell" size={24} color={selectedTab === 'exercises' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.55)'} />
              {selectedTab === 'exercises' && <Text style={styles.iconText}>Exercises</Text>}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, selectedTab === 'recipes' && styles.selectedIcon]}
            onPress={() => setSelectedTab('recipes')}
          >
            <View style={styles.iconContent}>
              <MaterialCommunityIcons name="ruler" size={24} color={selectedTab === 'recipes' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.55)'} />
              {selectedTab === 'recipes' && <Text style={styles.iconText}>Recipes</Text>}
            </View>
          </TouchableOpacity>
        </View>
        {/* Icon Row End*/}

        {/* Replace the existing DataBox with the new tab content */}
        {renderTabContent()}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 0, 1)',
  },
  scrollView: {
    flex: 1,
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

  // Profile Info Start
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    top: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    boxShadow: '0 0 14px rgba(255, 255, 255, 1)',
  },
  editIcon: {
    top: 134,
    position: 'absolute',
    bottom: 0,
    left: 75,
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
    top: 60,
    textShadow: '0 0 8px rgba(0, 0, 0, 1)',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontWeight: 500,
  },
  profileUsername: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Profile Info End

  // Profile Stats Start
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginTop: 60,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    textShadow: '0 0 6px rgba(0, 0, 0, 0.4)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  // Profile Stats End

  // Edit Profile Button Start
  editProfileButton: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Edit Profile Button End

  // Premium Promo Box Start
  premiumPromoContainer: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  premiumPromoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumPromoTextContainer: {
    flex: 1,
  },
  premiumPromoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  premiumPromoSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  tryPremiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
  },
  tryPremiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Premium Promo Box End

  // User Quick Stats Start
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  iconButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  iconContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  selectedIcon: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  iconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  DataBox: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 18,
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  noDataText: {
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 10,
    fontSize: 16,
  },
  // User Quick Stats End

  // Calendar Quick Stat Start
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 0,
  },
  calendarTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  weekDayText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    width: 25,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    height: 32,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayWrapper: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.5,
  },
  dayText: {
    color: '#fff',
    fontSize: 12,
  },
  todayWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  todayText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Calendar Quick Stat End

  // Add specific styles for each tab section here
  measurementsContainer: {
    // Add styles for recipes tab
  },

  exercisesContainer: {
    // Add styles for exercises tab
  },

  // Steps Tab Component Start
  stepsDataBox: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  // Total Steps Component Start
  totalStepsContainer: {
    marginBottom: 15,
    borderRadius: 16,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.25)',
  },
  totalStepsContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    marginRight: 4,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flex: 1,
  },
  totalStepsTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentSteps: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rankText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  // Total Steps Component End
  // 
  // Steps Achievements Section Start
  stepsAchievementsContainer: {
    width: '100%',
    paddingBottom: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.25)',
  },
  stepsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  stepsAchievementTitle: {
    color: '#fff',
    fontSize: 14,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  badgeItem: {
    alignItems: 'center',
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(7, 94, 7, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(7, 94, 7, 1)',
    boxShadow: '0 0 16px rgba(7, 94, 7, 0.6)',
  },
  badgeTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  badgeNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeUnit: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 1,
  },
  badgeLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  // Steps Tab Component End
});

export default ProfileScreen;
