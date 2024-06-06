import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc';

const GenderSelection = () => {
  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`}>
        <Text style={tw`text-blue-500`}>Cancel</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8 text-center`}>Please select your gender</Text>
      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity style={[styles.genderCard, tw`flex-1 items-center justify-center mx-2`]}>
          <Icon name="mars" size={48} color="#00BFFF" />
          <Text style={tw`text-lg font-bold mt-2`}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genderCard, tw`flex-1 items-center justify-center mx-2`]}>
          <Icon name="venus" size={48} color="#FF6347" />
          <Text style={tw`text-lg font-bold mt-2`}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={tw`mt-6`}>
        <Text style={tw`text-blue-500 text-center`}>Prefer not to say</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`mt-2`}>
        <Text style={tw`text-blue-500 text-center`}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`absolute bottom-10 self-center`}>
        <Text style={tw`text-gray-500`}>Do you have an account? <Text style={tw`text-blue-500`}>Log in.</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  genderCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});

export default GenderSelection;
