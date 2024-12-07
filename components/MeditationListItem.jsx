import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';



const MeditationListItem = ({ meditation }) => {
    
    return (
      <Link href={`/meditation/${meditation.id}`} asChild>
        <Pressable style={tw`flex-row items-center gap-5`}>
          <View style={tw`bg-green-700 p-2 rounded-full`}>
            <FontAwesome name="check" size={16} color="white" />
          </View>
        <View style={tw`flex-1 p-5 py-8 border-2 border-gray-500 rounded-2xl`}>
          <Text style={tw`font-semibold text-2xl mb-2`}>
            {meditation.title}
          </Text>
          <View style={tw`flex-row items-center gap-1`}>
          <FontAwesome6 name="clock" size={16} color="#6B7280" />
          <Text style={tw`text-gray-600`}>
            {meditation.duration} min
          </Text>
          </View>
        </View>
        </Pressable>
      </Link>

    )
}

export default MeditationListItem;

const styles = StyleSheet.create({})