import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useAuthContext } from '../AuthProvider';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      console.log('User ID not found');
      return;
    }
    console.log('Fetching history for user:', user._id);
    fetchExerciseHistory();
  }, [user]);

  const fetchExerciseHistory = async () => {
    try {
      const response = await axios.get(`http://192.168.1.45:5000/history/${user._id}`);
      if (response.data) {
        // Fetch the exercise details by exerciseId
        const updatedHistory = await Promise.all(
          response.data.map(async (entry) => {
            const exerciseId = parseInt(entry.exerciseId, 10); // Convert exerciseId to number

            let exerciseName = 'Unknown Exercise';
            try {
              const exerciseResponse = await axios.get(`http://192.168.1.45:5000/exercises/${exerciseId}`);
              if (exerciseResponse.data) {
                exerciseName = exerciseResponse.data.name;
              }
            } catch (error) {
              console.error(`Error fetching exercise name for ID ${exerciseId}:`, error);
            }

            // Return the updated entry with exercise name and date with time
            return {
              date: new Date(entry.dateLogged).toLocaleString(), // Including both date and time
              exerciseId: entry.exerciseId,
              exerciseName,
              value: entry.weight * entry.reps * entry.sets,
              detail: `${entry.weight} kg, ${entry.sets} sets, ${entry.reps} reps`
            };
          })
        );
        setHistoryData(updatedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch exercise history:', error);
    }
  };

  const lineChartData = {
    labels: historyData.map(item => `${item.date} - ${item.exerciseName} (${item.exerciseId})`),
    datasets: [{
      data: historyData.map(item => item.value),
      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,  // Blue line
      strokeWidth: 3,
    }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progress Charts</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: 'transparent',  // Transparent background
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: '6', // Dot size
            strokeWidth: '2',
            stroke: '#1E88E5',  // Dot border color
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      <View style={styles.historyList}>
        {historyData.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>
              {item.date} - (ID: {item.exerciseId}) - {item.exerciseName} - {item.detail}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  historyList: {
    marginTop: 20,
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ChartScreen;
