import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
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
      const response = await axios.get(`http://192.168.1.216:5000/history/${user._id}`);
      if (response.data) {
        setHistoryData(response.data.map(entry => ({
          date: new Date(entry.dateLogged).toLocaleDateString(),
          exerciseId: entry.exerciseId,  // Maintained as a number
          value: entry.weight * entry.reps * entry.sets,
          detail: `${entry.weight} kg, ${entry.sets} sets, ${entry.reps} reps`
        })));
      }
    } catch (error) {
      console.error('Failed to fetch exercise history:', error);
    }
  };

  const lineChartData = {
    labels: historyData.map(item => `${item.date} - Exercise ID: ${item.exerciseId}`),
    datasets: [{
      data: historyData.map(item => item.value),
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Progress Charts</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </ScrollView>
  );
};

export default ChartScreen;
