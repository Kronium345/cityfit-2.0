import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer'; 
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <Image
          source={require('../../assets/images/cityfit-logo.png')} 
          width={80}
          height={80}
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@email.com</Text>
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
        style={{ backgroundColor: pathname == "/stepCounter" ? "#ADD8E6" : "#fff" }}
        onPress={() => {
          router.push("/stepCounter"); // Correct Step Counter path
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      {/* Add the screens you want inside the Drawer */}
      <Drawer.Screen name="home" options={{ headerShown: true }} />
      <Drawer.Screen name="exercises" options={{ headerShown: true }} />
      <Drawer.Screen name="mental" options={{ headerShown: true }} />
      <Drawer.Screen name="foodScreen" options={{ headerShown: true }} />
      <Drawer.Screen name="stepCounter" options={{ headerShown: true }} />
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
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});
