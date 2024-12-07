import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import tw from 'twrnc';
import { meditations } from '../data/meditation-data'; // Corrected import
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from "@react-native-community/slider";
import { Audio } from 'expo-av';  // Corrected import from expo-av

const MeditationDetails = () => {
  const { id } = useLocalSearchParams(); // Get the ID from params
  const router = useRouter();
  const [sound, setSound] = useState();
  const [status, setStatus] = useState({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
  });

  // Find meditation based on ID
  const meditation = meditations.find(meditation => meditation.id === parseInt(id));

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/meditations/example-audio.mp3') // Example audio path
        );
        setSound(sound);
        
        // Set up event listeners for playback status
        sound.setOnPlaybackStatusUpdate((status) => {
          console.log('Playback status updated:', status);  // Debugging the status
          setStatus(status);  // Update state with the current status
        });
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    return () => {
      // Cleanup audio when the component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playPauseAudio = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };

  const formatSeconds = (milliseconds) => {
    if (isNaN(milliseconds)) return '00:00';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle case when meditation is not found
  if (!meditation) {
    return (
      <View>
        <Text style={tw`text-xl`}>Meditation not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`bg-orange-400 flex-1 p-2 justify-between`}>
      {/* Page Content */}
      <View style={tw`flex-1`}>
        {/* The Upper Top of Screen */}
        <View style={tw`flex-1`}>
          {/* Header */}
          <View style={tw`flex-row items-center justify-between p-10`}>
            <AntDesign name="infocirlceo" size={24} color="black" />
            <View style={tw`bg-zinc-900 p-2 rounded-md`}>
              <Text style={tw`text-zinc-100 font-semibold`}>Today's meditation</Text>
            </View>
            <AntDesign onPress={() => router.back()} name="close" size={26} color="black" />
          </View>
          <Text style={tw`text-3xl mt-6 text-center text-zinc-800 font-semibold`}>
            Meditation Details: {meditation?.title}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <Pressable onPress={playPauseAudio} style={tw`bg-zinc-800 self-center w-24 aspect-square rounded-full items-center justify-center mt-10`}>
          <FontAwesome6 name={status.isPlaying ? 'pause' : 'play'} size={24} color="snow" />
        </Pressable>

        {/* Bottom Part of Screen */}
        <View style={tw`flex-1`}>
          {/* Footer/Player */}
          <View style={tw`p-5 mt-auto gap-5`}>
            <View style={tw`flex-row justify-between`}>
              <MaterialIcons name="airplay" size={24} color="#3A3937" />
              <MaterialCommunityIcons name="cog-outline" size={24} color="#3A3937" />
            </View>
            {/* Playback Feature */}
            <Slider
              style={tw`w-full h-[40px]`}
              value={status.currentTime / status.duration}
              onSlidingComplete={(value) => sound?.setPositionAsync(value * status.duration)}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#3A3937"
              maximumTrackTintColor="#3A393755"
              thumbTintColor="#3A3937"
            />
            {/* Times */}
            <View style={tw`flex-row justify-between`}>
              <Text>{formatSeconds(status.currentTime)}</Text>
              <Text>{formatSeconds(status.duration)}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MeditationDetails;

const styles = StyleSheet.create({});
