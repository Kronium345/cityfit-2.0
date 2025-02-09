import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Button, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

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


const MentalHomePage = () => {
  const router = useRouter();  // Use useRouter hook for navigation
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);

  const boxesData = [
    { nav: 'Assessment', text: "Take a Self Test (Anger & Anxiety Assessment)", image: 'https://static.vecteezy.com/system/resources/previews/003/206/208/original/quiz-time-neon-signs-style-text-free-vector.jpg' },
    { nav: 'Exercise', text: "Explore Daily Exercise for a Healthy Life", image: 'https://plus.unsplash.com/premium_photo-1679938885972-180ed418f466?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { nav: 'Doctors', text: "Find Doctor", image: 'https://png.pngtree.com/thumb_back/fh260/background/20210827/pngtree-doctor-holding-stethoscope-in-hand-against-white-background-image_764536.jpg' },
    { nav: 'Hospitals', text: "Find Hospital", image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { nav: 'Readings', text: "Read Articles About Anxiety, Anger and Symptoms", image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80' },
    { nav: 'Emergency', text: "Emergency Contacts", image: 'https://www.bing.com/th?id=OCII.8D5C9E3A4AAA9E6608CA8098AD0013D1E9CC893B9DC33CF83851C9D34D2717FD&pid=3.1&w=490&h=340&p=0' }
  ];

  const renderBoxes = () => {
    return boxesData.map((box) => (
      <TouchableOpacity key={box.text} style={styles.boxContainer} onPress={() => router.push(`/${box.nav}`)}>  {/* Use router.push for navigation */}
        <ImageBackground source={{ uri: box.image }} style={styles.boxImage}>
          <Text style={styles.boxText}>{box.text}</Text>
        </ImageBackground>
      </TouchableOpacity>
    ));
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
          <Text style={styles.headerTitle}>Mind Center</Text>
          <View style={styles.headerRight} />
        </View>
        {/* Screen Header End */}


        {/* Main Component Start */}
        <View style={styles.innerContainer}>{renderBoxes()}</View>
        {/* Main Component End */}
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
                <Ionicons name="fitness" size={24} color="#fff" style={styles.modalIcon} />
                <Text style={styles.modalText}>Exercises</Text>
              </TouchableOpacity>
              {/* Exercise Page End */}

              {/* Mental Button Start */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  router.push('/mental');
                  setIsMoreModalVisible(false);
                }}
              >
                <Feather name="activity" size={24} color="#fff" style={styles.modalIcon} />
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
                <Ionicons name="fast-food-outline" size={24} color="#fff" style={styles.modalIcon} />
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
                <Ionicons name="settings-outline" size={24} color="#fff" style={styles.modalIcon} />
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
        <Feather name="grid" size={25} color="#fff" />
        <Text style={[styles.tabLabel, styles.activeTab]}>More</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/planScreen')}
      >
        <Feather name="plus" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/home')}
      >
        <Feather name="home" size={24} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/workout')}
      >
        <Feather name="bar-chart" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Charts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => router.push('/(drawer)/(tabs)/profileScreen')}
      >
        <Feather name="user" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </BlurView>
  );
};
// Custom Tab Bar End

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
    backdropFilter: 'blur(4px)',
  },
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  modalItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    boxShadow: '0 0 6px rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 8,
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





  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 50,
  },
  boxContainer: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',  // Ensure content doesn't overflow the rounded corners
  },
  boxImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',  // Push the text to the bottom of the image
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.8,  // Adjust opacity for better visibility
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    // backgroundColor: '#FAFAFA',
    paddingVertical: 16,
    paddingHorizontal: 3,
  },
});

export default MentalHomePage;
