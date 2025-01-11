import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon package
import FoodListItem from '../components/FoodListItem';
import axios from 'axios'; // Import axios to make API requests

const foodHomeScreen = () => {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState([]);  // Store the fetched food items
  const [loading, setLoading] = useState(false);  // To show loading spinner when fetching

  // Perform search using Open Food Facts API
  const performSearch = async () => {
    if (!search.trim()) return;  // Exit if search is empty

    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search}&search_simple=1&action=process&json=1`);
      const products = response.data.products || []; // Get products from the response

      // Log data to inspect its structure
      console.log("Fetched products:", products);

      const formattedProducts = products.map(product => ({
        label: product.product_name || 'Unknown', // Ensure label is not undefined
        cal: product.nutriments.energy_100g,  // Check both energy fields        brand: product.brands || 'Unknown',  // Brand name
        carbohydrates: product.nutriments ? product.nutriments.carbohydrates_100g : 'N/A',  // Carbs in 100g
        fats: product.nutriments ? product.nutriments.fat_100g : 'N/A',  // Fats in 100g
        proteins: product.nutriments ? product.nutriments.proteins_100g : 'N/A',  // Proteins in 100g
        sugars: product.nutriments ? product.nutriments.sugars_100g : 'N/A',  // Sugars in 100g
        imageUrl: product.image_url || 'N/A',  // Image URL
        countries: product.countries_tags || 'N/A',  // Available countries
      }));

      // Set the fetched items to state
      setFoodItems(formattedProducts);  
    } catch (error) {
      console.error('Error fetching data from Open Food Facts:', error);
    } finally {
      setLoading(false);  // Set loading to false after the fetch is done
    }
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search food...'
          style={styles.input}
        />
        <TouchableOpacity onPress={performSearch} style={styles.searchIcon}>
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={foodItems}
          renderItem={({ item }) => (
            <FoodListItem item={item} />  // This should render a custom component for each food item
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: 5 }}
        />
      )}
    </View>
  );
};

export default foodHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
});
