import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const NewSetInput = ({ onLogExercise }) => {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const logExercise = () => {
    onLogExercise(parseInt(sets, 10), parseInt(reps, 10), parseFloat(weight));
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Sets" value={sets} onChangeText={setSets} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Reps" value={reps} onChangeText={setReps} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <Button title="Log Exercise" onPress={logExercise} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default NewSetInput;
