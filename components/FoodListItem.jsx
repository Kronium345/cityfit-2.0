import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons'; // Using AntDesign for the icon

const FoodListItem = ({ item }) => {
  // Log item to inspect data being passed to this component
  console.log("FoodListItem received:", item);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        {/* Display the product name */}
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.label}</Text>

        {/* Display the brand */}
        <Text style={{ color: 'dimgray' }}>{item.brand}</Text>

        {/* Display the nutritional information */}
        <Text>Calories per 100g: {item.cal} kcal</Text>
        <Text>Carbs per 100g: {item.carbohydrates} g</Text>
        <Text>Fats per 100g: {item.fats} g</Text>
        <Text>Proteins per 100g: {item.proteins} g</Text>
        <Text>Sugars per 100g: {item.sugars} g</Text>

        {/* Display the countries where the product is available */}
        <Text>Available in: {item.countries}</Text>
      </View>

      {/* Display the image of the food item if available */}
      {item.imageUrl && item.imageUrl !== 'N/A' ? (
        <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
      ) : null}

      {/* Plus icon for adding the item */}
      <AntDesign name="pluscircleo" size={24} color="royalblue" />
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
