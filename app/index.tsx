import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Index = () => {
  const router = useRouter();
  return (
    <View style={tw`flex-1 bg-black`}>
      <StatusBar style='light' />
      <Image 
        style={[tw`absolute`, { height: hp(100), width: wp(100) }]} 
        source={require('../assets/images/welcome-img.jpg')} 
        resizeMode="cover"
      />
      
      {/* Add these two overlay components */}
      <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />
      
      {/* Title Container */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()} 
        style={styles.titleContainer}
      >
        <Text style={styles.titleText}>
          Fit Minds, <Text style={styles.highlightText}>Strong Bodies</Text>
        </Text>
      </Animated.View>

      {/* Description and Buttons Container */}
      <Animated.View 
        entering={FadeInDown.delay(200).springify()} 
        style={styles.buttonContainer}
      >
        <Text style={styles.descriptionText}>
        Designed to accelerate your fitness goals. From personalised workout plans to calorie tracking,
        join thousands of university students who are already achieving their goals with us.
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.primaryButtonText}>Start now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default Index;

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: hp(10), // Add some top padding
    marginBottom: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    paddingHorizontal: 24,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  highlightText: {
    color: '#FF6347',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#FF6347',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // uniform translucent overlay
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(60), // gradient covers bottom 60% of screen
  },
});
