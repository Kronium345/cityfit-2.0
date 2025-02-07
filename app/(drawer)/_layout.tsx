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


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleAppReview = () => {
    // Implement the logic to handle app review
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.mainContent}>
        <View style={styles.userInfoWrapper}>
          <Image
            source={require('../../assets/images/cityfit-logo.png')} 
            width={80}
            height={80}
            style={styles.userImg}
          />
          <View style={styles.userDetailsWrapper}>
            <Text style={styles.userName}>{`${userData.firstName} ${userData.lastName}`}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>
        <DrawerItem
          icon={({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          )}
          label={"Home"}
          labelStyle={[
            styles.navItemLabel, 
            { color: pathname == "/home" ? "#fff" : "#000", paddingLeft: 20 },
          ]}
          style={{ backgroundColor: pathname == "/home" ? "#ADD8E6" : "#fff" }}
          onPress={() => {
            router.push("/(drawer)/(tabs)/home"); // Correct Home screen path
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          )}
          label={"Exercises"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/exercises" ? "#fff" : "#000", paddingLeft: 20 },
          ]}
          style={{ backgroundColor: pathname == "/exercises" ? "#ADD8E6" : "#fff" }}
          onPress={() => {
            router.push("/exercises"); // Correct Exercises screen path
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          )}
          label={"Mental"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/mental" ? "#fff" : "#000", paddingLeft: 20 },
          ]}
          style={{ backgroundColor: pathname == "/mental" ? "#ADD8E6" : "#fff" }}
          onPress={() => {
            router.push("/mental"); // Correct Mental screen path
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialIcons name="fastfood" size={size} color={color} />
          )}
          label={"Food Screen"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/foodScreen" ? "#fff" : "#000", paddingLeft: 20 },
          ]}
          style={{ backgroundColor: pathname == "/foodScreen" ? "#ADD8E6" : "#fff" }}
          onPress={() => {
            router.push("/foodScreen"); // Correct Food Screen path
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          )}
          label={"Step Counter"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/stepCounter" ? "#fff" : "#000", paddingLeft: 20 },
          ]}
          style={{ backgroundColor: pathname == "/stepCounter" ? "#ADD8E6" : "#000" }}
          onPress={() => {
            router.push("/stepCounter"); // Correct Step Counter path
          }}
        />
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
            <Feather name="globe" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://instagram.com/fitnessoneltd')}
          >
            <AntDesign name="instagram" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={handleAppReview}
          >
            <AntDesign name="star" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
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
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  userImg: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  userDetailsWrapper: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
  socialSection: {
    paddingVertical: 20,
    marginTop: 'auto',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#666',
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
  },
});
