import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();
  return (
    <View style={tw`flex-1`}>
      <StatusBar style='light' />
      <Image 
        style={[tw`absolute`, { height: hp(100), width: wp(100), resizeMode: 'cover' }]} 
        source={require('../assets/images/welcome.jpg')} 
      />
      <Animated.View entering={FadeInDown.delay(100).springify()} style={tw`absolute top-1/2 w-full items-center py-40`}>
        <Animated.View style={{ transform: [{ translateY: -hp(25) }] }}>
          <Text style={tw`text-white text-4xl font-bold text-center`}>
            Fit Minds, <Text style={tw`text-rose-500`}>Strong Bodies</Text>
          </Text>
          <Text style={tw`text-white text-center mt-4`}>
            Welcome to CityFit 💪, your ultimate fitness companion tailored for our
            university community! Get personalized workout plans, nutrition
            guidance, and join a vibrant student community to crush your fitness
            goals!
          </Text>
        </Animated.View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).springify()} style={[tw`absolute bottom-12 w-full items-center px-4`]}>
        <TouchableOpacity style={[tw`w-full py-4 rounded-full`, { backgroundColor: '#FF6347' }]} onPress={() => router.push('signup')}>
          <Text style={tw`text-white text-center text-lg`}>
            Start now
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw`w-full py-4 mt-4 rounded-full`, { backgroundColor: '#FFF' }]} onPress={() => router.push('login')}>
          <Text style={[tw`text-center text-lg`, { color: '#FF6347' }]}>
            Log in
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})
