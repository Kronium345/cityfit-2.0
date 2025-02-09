import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import Animated, {
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


// Add this helper function at the top of the file, outside the component
const getCountryFlag = (countryCode: string) => {
  const OFFSET = 127397;
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => char.charCodeAt(0) + OFFSET);
  return String.fromCodePoint(...codePoints);
};

export default function RateScreen() {
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState(0);

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  const testimonials = [
    {
      id: 1,
      name: 'James Wilson',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      countryCode: 'GB',
      location: 'UK',
      date: 'March 15, 2024',
      subject: 'Great Workout Companion!',
      review: "This app has completely transformed my fitness journey. The interface is intuitive and the workout plans are well-structured.",
      rating: 3
    },
    {
      id: 2,
      name: 'Sarah Miller',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      countryCode: 'GB',
      location: 'UK',
      date: 'March 14, 2024',
      subject: 'Perfect for Beginners',
      review: "As someone new to fitness, this app has been incredibly helpful. The guidance and progress tracking are excellent.",
      rating: 1
    },
    {
      id: 3,
      name: 'David Chen',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      countryCode: 'GB',
      location: 'UK',
      date: 'March 13, 2024',
      subject: 'Excellent Progress Tracking',
      review: "The way this app tracks and visualizes progress is outstanding. It keeps me motivated and focused on my goals.",
      rating: 4
    },
    {
      id: 4,
      name: 'Emma Thompson',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      countryCode: 'GB',
      location: 'UK',
      date: 'March 12, 2024',
      subject: 'Love the Workout Variety',
      review: "There's such a great variety of workouts available. I never get bored and always feel challenged in the best way.",
      rating: 5
    }
  ];

  const arrowAnimation = useAnimatedStyle(() => ({
    transform: [{
      translateY: withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(10, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      ),
    }],
  }));

  return (
    <View style={styles.container}>
      <BlobBackground />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
              <Ionicons name="chevron-back" size={24} color="#fff" />

            </BlurView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Fitness One</Text>
        </View>


        {/* Testimonial Section Start */}
        <View style={styles.testimonialSection}>
          <Text style={styles.testimonialTitle}>What others are saying</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialCarousel}
          >
            {testimonials.map((testimonial) => (
              <View key={testimonial.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <Image
                      source={{ uri: testimonial.image }}
                      style={styles.profilePic}
                    />
                    <View>
                      <Text style={styles.reviewerName}>{testimonial.name}</Text>
                      <View style={styles.locationContainer}>
                        <Text style={styles.flagEmoji}>
                          {getCountryFlag(testimonial.countryCode)}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {testimonial.location} • {testimonial.date}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewSubject}>{testimonial.subject}</Text>
                <Text style={styles.reviewBody}>{testimonial.review}</Text>
                <View style={styles.reviewStars}>
                  {Array(testimonial.rating).fill(0).map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={16}
                      color="#fff"
                      style={styles.reviewStar}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Join many of the people within our community who have shared their experiences with the Fitness One app!{'\n\n'}
              Your feedback is valuable for us to make this app the best it can be.
            </Text>
          </View>

          <View style={styles.arrowsContainer}>
            <Animated.View style={[styles.arrow, arrowAnimation]}>
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </Animated.View>
            <Animated.View style={[styles.arrow, arrowAnimation]}>
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </Animated.View>
            <Animated.View style={[styles.arrow, arrowAnimation]}>
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </Animated.View>
          </View>
        </View>
        {/* Testimonial Section End */}


        {/* Store Rating Component Start */}
        <View style={styles.storeSection}>
          <Text style={styles.storeTitle}>Review our app on the store</Text>
          <Text style={styles.storeSubtitle}>Your review helps others discover our app</Text>

          <View style={styles.storeButtons}>
            <TouchableOpacity style={styles.storeButton} onPress={() => Linking.openURL('https://apps.apple.com/gb/app/cityfit/id6502287676')}>
              <View style={styles.storeBadgeContainer}>
                <Ionicons name="logo-apple" size={24} color="#fff" />
                <Text style={styles.storeBadgeText}>App Store</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.storeButton} onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.cityfit.android&hl=en_GB')}>
              <View style={styles.storeBadgeContainer}>
                <Ionicons name="logo-google-playstore" size={24} color="#fff" />
                <Text style={styles.storeBadgeText}>Play Store</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Store Rating Component End */}

      </ScrollView>
    </View>
  );
}

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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },

  // Testimonial Section Start
  testimonialSection: {
    marginTop: 40,
    paddingBottom: 24,
  },
  testimonialTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  testimonialCarousel: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 300,
  },
  star: {
    marginHorizontal: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reviewDate: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  reviewSubject: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewBody: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewStar: {
    marginRight: 4,
  },
  flagEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  // Testimonial Section End

  // Message Box Start
  messageContainer: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  arrowsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  arrow: {
    opacity: 0.8,
  },
  // Message Box End

  // Store Rating Component Start
  storeSection: {
    paddingHorizontal: 20,
  },
  storeTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  storeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  storeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  storeButton: {
    height: 40,
    minWidth: 135,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  storeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  storeBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Store Rating Component En

});
