import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { meditations } from '../data/meditation-data'; // Ensure correct import
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';



const MeditationDetails = () => {
  const { id } = useLocalSearchParams(); // Get the ID from params
  const meditation = meditations.find(meditation => meditation.id === parseInt(id)); // Find meditation based on ID

  // Handle case when meditation is not found
  if (!meditation) {
    return (
      <View style={styles.container}>
        <Text style={tw`text-xl`}>Meditation not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`bg-orange-400 flex-1 p-2`}>
      {/* Header */}
        <View style={tw`flex-row items-center justify-between p-10`}>
          <AntDesign name="infocirlceo" size={24} color="black" />
        <View style={tw`bg-zinc-900 p-2 rounded-md`}>
          <Text style={tw`text-zinc-100 font-semibold`}>Today's meditation</Text>
        </View>
        <AntDesign onPress={() => router.back()} name="close" size={26} color="black" />
      </View>
        <Text style={tw`text-3xl mt-10 text-center text-zinc-800 font-semibold`}>Meditation Details: {meditation?.title}</Text>
        
        {/* Play/Pause Button */}
        <Pressable style={tw`bg-zinc-800 self-center w-24 aspect-square rounded-full items-center justify-center`}>
          <FontAwesome6 name="play" size={24} color="snow" />
        </Pressable>

        {/* Footer/Player */}
        <View>
          <View>
            <FontAwesome6 name="play" size={24} color="dimgray" />
            <FontAwesome6 name="play" size={24} color="snow" />
          </View>
        </View>
    </SafeAreaView>
  );
};

export default MeditationDetails;

const styles = StyleSheet.create({});
