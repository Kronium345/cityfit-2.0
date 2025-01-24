import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { useRouter } from 'expo-router';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');



const FoodScreen = () => {
    const router = useRouter();

    const navigateToFoodHomeScreen = () => {
        router.push('/foodDetails'); // Ensure you're pointing to the correct route in tabs
      };

  const entries = [
    { title: "We’re with you all the way!", text: "Break free from the cycle of crash diets and quick fixes. Let's embrace a holistic approach to craft the vibrant health and resilient mindset you deserve.", image: require('../../assets/images/food-image-1.jpg') },
    { title: "Transforming your life and get healthier.", text: "Bite Back Coaching isn’t just about transforming your body. It is about transforming your life. Feeling better, more confident, happier, and best of all, HEALTHIER.", image: require('../../assets/images/food-image-2.jpg') },
    { title: "Results without any restrictions!", text: "No more yo-yo diets, no more fat burners, no more restrictive diets, no more fasting, no more food guilt. Instead, we work together to build the body and mindset of your dreams.", image: require('../../assets/images/food-image-3.jpg') }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={entries}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={(index) => setActiveIndex(index)} // Ensures the index is updated
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{entries[activeIndex].title}</Text>
        <Text style={styles.text}>{entries[activeIndex].text}</Text>
        <TouchableOpacity onPress={navigateToFoodHomeScreen} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    borderRadius: 25, // Increased borderRadius for a more rounded appearance
    overflow: 'hidden', // Ensures the borderRadius is applied
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.4,
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'purple',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});
