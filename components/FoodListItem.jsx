import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons'; // Using AntDesign for the icon
import axios from 'axios';
import { useAuthContext } from '../app/AuthProvider';  // Assuming you're using AuthContext to get the user
import Toast from 'react-native-toast-message';

const FoodListItem = ({ item, showAddButton, onFoodAdded }) => {
  const { user } = useAuthContext();  // Dynamically getting user from AuthContext

  const handleAddFood = async () => {
    if (!user) {
      console.log("No user data available");
      return;
    }

     // Log the request body to verify all fields are correct
    console.log("Request body being sent:", {
      userId: user._id,
      label: item.label,
      cal: item.cal,
      carbohydrates: item.carbohydrates,
      fats: item.fats,
      proteins: item.proteins,
      sugars: item.sugars,
      imageUrl: item.imageUrl || 'N/A',
    });

    try {
      const response = await axios.post('http://localhost:5000/food/log', {
        userId: user._id,  // Using dynamic user._id
        label: item.label,
        cal: item.cal,
        carbohydrates: item.carbohydrates,
        fats: item.fats,
        proteins: item.proteins,
        sugars: item.sugars,
        imageUrl: item.imageUrl || 'N/A',
      });

      console.log("Food log response:", response.data);

      // Show a success toast message
      Toast.show({
        type: 'success',
        text1: 'Food Logged',
        text2: `${item.label} has been successfully logged!`,
        position: 'bottom',
        visibilityTime: 4000,
      });

      // Notify the parent component (foodDetails) that the food was added
      if (onFoodAdded) {
        onFoodAdded(response.data);
      }
    } catch (error) {
      console.error("Error logging food:", error);

      // Show an error toast if something goes wrong
      Toast.show({
        type: 'error',
        text1: 'Food Logging Failed',
        text2: 'There was an error logging the food.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.label}</Text>
        {/* <Text style={{ color: 'dimgray' }}>{item.brand}</Text> */}
        <Text>Calories per 100g: {item.cal} kcal</Text>
        <Text>Carbs per 100g: {item.carbohydrates} g</Text>
        <Text>Fats per 100g: {item.fats} g</Text>
        <Text>Proteins per 100g: {item.proteins} g</Text>
        <Text>Sugars per 100g: {item.sugars} g</Text>
        <Text>Available in: {item.countries}</Text>
      </View>

      {item.imageUrl && item.imageUrl !== 'N/A' ? (
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
      ) : null}

      {/* Show the Plus icon only if showAddButton is true */}
      {showAddButton && (
        <TouchableOpacity onPress={handleAddFood}>
          <AntDesign name="pluscircleo" size={24} color="royalblue" />
        </TouchableOpacity>
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default FoodListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F8',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
