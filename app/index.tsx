import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useEffect } from 'react';
import tw from 'twrnc';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-snap-carousel';
import { BlurView } from 'expo-blur';

import Animated, {
  FadeInDown,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
  const blob1Animation = useSharedValue(0);
  const blob2Animation = useSharedValue(0);
  const blob3Animation = useSharedValue(0);

  useEffect(() => {
    const animate = (value: any, duration: number) => {
      'worklet';
      value.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    };

    animate(blob1Animation, 8000);
    animate(blob2Animation, 12000);
    animate(blob3Animation, 10000);
  }, []);

  const createBlobStyle = (animation: any) => {
    'worklet';
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { translateX: animation.value * 40 - 20 },
        { translateY: animation.value * 40 - 20 }
      ]
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
      <View style={styles.container}>
      <BlobBackground />
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
      </View>
    </View>
  )
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 0, 1)',
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
