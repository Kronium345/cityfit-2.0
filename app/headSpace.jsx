import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { meditations } from './data/meditation-data'; // Corrected import
import tw from 'twrnc';
import MeditationListItem from '../components/MeditationListItem';



const headSpace = () => {
  return (
    <FlatList
        data={meditations}
        style={tw`bg-white`}
        contentContainerStyle={{ gap: 20, padding: "3px" }}
        renderItem={({ item }) => <MeditationListItem meditation={item} />} 
    />
  )
}

export default headSpace

const styles = StyleSheet.create({})