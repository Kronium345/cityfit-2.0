// ProgressGraph.jsx
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { LineGraph } from 'react-native-graph';

const ProgressGraph = ({ sets = [] }) => {
  const idToDate = (id) => {
    const timestamp = parseInt(id.substr(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  const points = sets.map((set) => ({
    date: idToDate(set._id),
    value: set.reps * set.weight, // Calculating total volume as weight * reps
  }));

  return (
    <View style={styles.container}>
      <Text>Progress Graph</Text>
      <LineGraph points={points} animated={false} color="#4484B2" style={styles.graph} />
    </View>
  );
};

export default ProgressGraph;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    gap: 5,
  },
  graph: {
    width: '100%',
    height: 200,
  },
});
