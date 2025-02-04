import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import FoodListItem from '../components/FoodListItem';
import axios from 'axios';
import { useAuthContext } from '../app/AuthProvider';
import Toast from 'react-native-toast-message';

const foodDetails = () => {
  const [foodLogs, setFoodLogs] = useState([]); // To store food logs for today
  const [totalCalories, setTotalCalories] = useState(0);
  const { user } = useAuthContext();  // Dynamically getting user from AuthContext

  // Log user data to confirm it's available
  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      fetchFoodLogs();
    }
  }, [user]);

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  const fetchFoodLogs = async () => {
    if (!user) {
      console.log("No user data available");
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
      const response = await axios.get(`http://localhost:5000/food/log/${user._id}?date=${today}`);
      setFoodLogs(response.data);
      const totalKcal = response.data.reduce((sum, item) => sum + item.cal, 0);
      setTotalCalories(totalKcal); // Set total calories for the day
      console.log("Food logs fetched:", response.data);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subTitle}>Calories</Text>
        <Text>{totalCalories} kcal</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subTitle}>Today's Food</Text>
        <Link href="/foodHomeScreen" asChild>
          <Button title="Add Food" />
        </Link>
      </View>
      <FlatList
        data={foodLogs}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => (
          <FoodListItem item={item} onAddFood={() => handleAddFood(item)} showAddButton={false} />  // Pass the entire item object to the FoodListItem component
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default foodDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
    gap: 10
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    color: "dimgray"
  }
});
