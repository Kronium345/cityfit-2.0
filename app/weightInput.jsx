import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';

const WeightInput = () => {
  return (
    <View style={tw`flex-1 bg-gray-100 px-6 pt-10`}>
      <StatusBar style='dark' />
      <TouchableOpacity style={tw`absolute top-5 left-5`}>
        <Text style={tw`text-blue-500`}>Back</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-8`}>How much do you weigh?</Text>
      <View style={[styles.inputContainer, tw`mb-6`]}>
        <Text style={tw`text-lg`}>Weight</Text>
        <TextInput style={styles.input} placeholder="Please select" />
      </View>
      <View style={[styles.inputContainer, tw`mb-6`]}>
        <Text style={tw`text-lg`}>Import</Text>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`flex-1`}>Health Connect</Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500`}>Toggle</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={tw`mt-6`}>
        <Text style={tw`text-blue-500 text-center`}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[tw`w-full py-4 rounded-full mt-6`, { backgroundColor: '#ADD8E6' }]}>
        <Text style={tw`text-white text-center text-lg`}>Done</Text>
      </TouchableOpacity>
      <Text style={tw`text-center text-gray-500 mt-6`}>
        By continuing, you agree to our <Text style={tw`text-blue-500`}>terms of service</Text> and <Text style={tw`text-blue-500`}>privacy policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
    marginTop: 5,
  },
});

export default WeightInput;
