import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import StepValue from '../components/StepValue';
import StepRingProgress from '../components/StepRingProgress';
// import { initialize, requestPermission, readRecords } from 'react-native-health-connect';

const StepCounter = () => {
// Initialize HealthConnect and request permissions
// useEffect(() => {
//   const initHealthConnect = async () => {
//     const isInitialized = await initialize(); // Initialize HealthConnect API
//     if (isInitialized) {
//       const grantedPermissions = await requestPermission([
//         { accessType: 'read', recordType: 'StepCount' },
//       ]);

//       // Check if permissions are granted
//       if (grantedPermissions) {
//         console.log('Permissions granted for StepCount');
//       } else {
//         console.log('Permissions denied');
//       }
//     }
//   };
//   initHealthConnect();
// }, []);

// const fetchStepData = async () => {
//   try {
//     const result = await readRecords('StepCount', {
//       timeRangeFilter: {
//         operator: 'between',
//         startTime: '2023-01-09T12:00:00.405Z',
//         endTime: '2023-01-09T23:53:15.405Z',
//       },
//     });
//     console.log('Fetched Step Data:', result);
//   } catch (error) {
//     console.error('Error fetching step data:', error);
//   }
// };

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
