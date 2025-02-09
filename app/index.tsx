import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');

const carouselItems = [
  {
    image: require('../assets/images/carousel/slide1.jpg'),
    caption: 'Vote Trump'
  },
  {
    image: require('../assets/images/carousel/slide1.jpg'),
    caption: 'Vote Trump'
  },
  {
    image: require('../assets/images/carousel/slide1.jpg'),
    caption: 'Vote Trump'
  },
  {
    image: require('../assets/images/carousel/slide1.jpg'),
    caption: 'Vote Trump'
  }
];

const Index = () => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = React.useState(0);

  const renderCarouselItem = ({ item, index }) => {
    return (
      <View style={styles.carouselItem}>
        <BlurView intensity={20} tint="light" style={styles.blurContainer}>
          <Image source={item.image} style={styles.carouselImage} />
        </BlurView>
        <Text style={styles.carouselCaption}>{item.caption}</Text>
      </View>
    );
  };

  return (
    <View style={tw`flex-1`}>
      <StatusBar style='light' />
      <LinearGradient
        colors={['#000000', '#004d00', '#003300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tw`flex-1`}
      >
        {/* Title Container */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()} 
          style={styles.titleContainer}
        >
          {/* <Text style={styles.welcomeText}>Welcome to</Text> */}
          <Image 
            source={require('../assets/images/logo-img/fitnessone-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Carousel Start */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()} 
          style={styles.carouselContainer}
        >
          <Carousel
            data={carouselItems}
            renderItem={renderCarouselItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth - 80}
            onSnapToItem={setActiveSlide}
            autoplay={true}
            autoplayInterval={4000}
            loop={true}
          />
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.paginationDot,
                  i === activeSlide ? styles.paginationDotActive : null
                ]}
              />
            ))}
          </View>
        </Animated.View>
        {/* Carousel End */}

        {/* Buttons Container */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()} 
          style={styles.buttonContainer}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryButtonText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  )
}

export default Index;

const styles = StyleSheet.create({
  // Title Container Start
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 500,
  },
  logoImage: {
    height: 200,
    width: 200,
    bottom: 55,
    opacity: 0.75,
  },
  // Title Container End

  // Carousel Start
  carouselContainer: {
    flex: 1,
    top: -50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    width: screenWidth - 80,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '100%',
    height: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselCaption: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,

  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 75,
    width: '100%',
  },
  paginationDot: {
    width: 9,
    height: 9,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 20,
    height: 9,
    borderRadius: 6,
  },
  // Carousel End

  // Buttons Container Start
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Buttons Container End
});
