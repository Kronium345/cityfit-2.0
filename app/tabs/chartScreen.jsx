import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useAuthContext } from '../AuthProvider';
import resistanceIcon from "../../assets/tracker-images/resistance.png"; // Only using resistance icon

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
    fetchExerciseHistory();  // Fetch data on mount
  }, [user]);

  // Fetch the exercise history
  const fetchExerciseHistory = async () => {
    try {
      const response = await axios.get(`http://192.168.1.48:5000/exercise/${user._id}`);
      console.log('Fetched history:', response.data);
      
      if (response.data) {
        const updatedHistory = response.data.map((entry) => {
          return {
            date: new Date(entry.dateLogged).toLocaleString(),
            exerciseName: entry.exerciseName,
            weight: entry.weight,
            sets: entry.sets,
            reps: entry.reps,
            detail: `${entry.weight} kg, ${entry.sets} sets, ${entry.reps} reps`
          };
        });
        setHistoryData(updatedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch exercise history:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Exercise History</Text>

      {historyData.length ? (
        <View style={styles.historyList}>
          {historyData.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.dateWrapper}>
                <Text style={styles.date}>{item.date}</Text>
              </View>

              <View style={styles.exerciseWrapper}>
                <Image
                  source={resistanceIcon} // Always using resistance icon
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.exerciseName}>{item.exerciseName}</Text>
                  <Text style={styles.exerciseDetail}>{item.detail}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text>No exercise history available.</Text>
      )}
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
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  dateWrapper: {
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#555',
  },
});

export default ChartScreen;
