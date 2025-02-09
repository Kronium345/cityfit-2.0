import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer'; 
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });

  const menuItems = [
    {
      icon: "home",
      label: "Home",
      route: "/(drawer)/(tabs)/home",
      color: 'rgba(102, 102, 102, 0.4)',
      iconComponent: Feather,
      image: require('../../assets/images/menu-img/steps.jpg')
    },
    {
      icon: "activity",
      label: "Exercises",
      route: "/exercises",
      color: 'rgba(102, 102, 102, 0.4)',
      iconComponent: Feather,
      image: require('../../assets/images/menu-img/exercises.jpg')
    },
    {
      icon: "appstore-o",
      label: "Mental",
      route: "/mental",
      color: 'rgba(102, 102, 102, 0.4)',
      iconComponent: AntDesign,
      image: require('../../assets/images/menu-img/mental.jpg')
    },
    {
      icon: "fastfood",
      label: "Food Screen",
      route: "/foodScreen",
      color: 'rgba(102, 102, 102, 0.4)',
      iconComponent: MaterialIcons,
      image: require('../../assets/images/menu-img/food.jpg')
    },
    {
      icon: "fitness",
      label: "Step Counter",
      route: "/stepCounter",
      color: 'rgba(102, 102, 102, 0.4)',
      iconComponent: Ionicons,
      image: require('../../assets/images/menu-img/terrain.jpg')
    }
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      key={item.label}
      style={[
        styles.menuItem,
        { backgroundColor: pathname === item.route ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }
      ]}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.menuItemCard, { backgroundColor: item.color }]}>
        <View style={styles.imageContainer}>
          <Image 
            source={item.image}
            style={styles.menuImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.itemFooter}>
          <item.iconComponent name={item.icon} size={20} color="white" />
          <Text style={styles.menuItemLabel}>{item.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAppReview = () => {
    // Implement the logic to handle app review
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        
        if (userJson) {
          const user = JSON.parse(userJson);
          // Fetch latest user data from the server
          const response = await axios.get(`http://localhost:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.drawerWrapper}>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.7)',
          'rgba(0, 77, 0, 0.7)',
          'rgba(0, 51, 0, 0.7)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.overlay]}
      />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.drawerContent}>

        {/* Profile Component Start */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {userData.avatar ? (
              <Image 
                source={{
                  uri: userData.avatar.includes('http')
                    ? userData.avatar
                    : `http://localhost:5000/${userData.avatar.replace(/\\/g, '/')}`
                }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>
                  {userData.firstName ? userData.firstName[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>
            {userData.firstName || 'User'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Feather name="x" size={18} color="white" />
          </TouchableOpacity>
        </View>
        {/* Profile Component End */}


        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>

        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </View>

          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>TAKE THIS FURTHER</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialIconsContainer}>
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://fitnessoneltd.com')}
              >
                <Ionicons name="globe-outline" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://chat.whatsapp.com/CQhtTVwImtp2XRyoJFTg1v')}
              >
                <Ionicons name="logo-whatsapp" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://instagram.com/fitnessoneltd')}
              >
                <Ionicons name="logo-instagram" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialIcon}
                onPress={() => Linking.openURL('https://linkedin.com/company/fitness-one/')}
              >
                <Ionicons name="logo-linkedin" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </DrawerContentScrollView>
      </View>
    </View>
  );
};

export default function DrawerLayout() {
  const IconWithBlur = ({ children }) => (
    <BlurView 
      intensity={20} 
      tint="light"
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {children}
    </BlurView>
  );

  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />} 
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: '100%',
        },
        overlayColor: 'transparent',

      }}
    >
      <Drawer.Screen 
        name="stepCounter" 
        options={{
          headerShown: true,
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
          headerTitle: ""
        }} 
      />
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    zIndex: 1,
  },
  drawerContent: {
    width: '90%',
    height: '98%',
    zIndex: 2,
    backgroundColor: 'transparent',
    borderRadius: 24,
    overflow: 'hidden',
  },
  drawerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: 6,
    top: 16,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Profile Component Start
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  // Profile Component End


  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  menuItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)',
  },
  menuItemCard: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 6,
  },
  imageContainer: {
    width: '100%',
    height: '65%',
    marginBottom: 8,
    boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  menuImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuItemLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  socialSection: {
    paddingVertical: 20,
    marginTop: 'auto',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
  },
  socialIcon: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 14px rgba(0, 0, 0, 0.15)',
  },
});
