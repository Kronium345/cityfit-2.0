import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const StepValue = ({ label, value}) => {
    // Add a return statement to render JSX
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

export default StepValue

const styles = StyleSheet.create({
    label: {
      color: 'white',
      fontSize: 20
    },
    value: {
      fontSize: 45,
      color: '#AFB3BE',
      fontWeight: '500'
    },
  
  });
  