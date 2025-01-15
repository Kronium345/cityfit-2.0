import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import StepValue from '../components/StepValue';
import StepRingProgress from '../components/StepRingProgress';
import { HealthConnect } from 'react-native-health-connect';


const StepCounter = () => {
  HealthConnect.init();
  return (
    <View style={styles.container}>
        <StepRingProgress radius={150} strokeWidth={50} progress={0.3} />
      <View style={styles.values}>
        <StepValue label="Steps" value="1219" />
        <StepValue label="Distance" value="0.75km" />
        <StepValue label="Flights Climbed" value="12" />
      </View>


      <StatusBar style="auto" />
    </View>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12
  },
  values: { 
    flexDirection: "row",
    gap: 25,
    flexWrap: "wrap",
    marginTop: 100
 },

});
