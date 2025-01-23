import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter from expo-router

const MentalHomePage = () => {
  const router = useRouter();  // Use useRouter hook for navigation

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

  return <View style={styles.container}>{renderBoxes()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
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
