import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon package
import { Ionicons } from '@expo/vector-icons';
import FoodListItem from '../components/FoodListItem';
import axios from 'axios';
import { Camera } from 'expo-camera';

const foodHomeScreen = () => {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState([]);  // Store the fetched food items
  const [loading, setLoading] = useState(false);  // To show loading spinner when fetching
  const [scannerActive, setScannerActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);  // This tracks the camera permissions

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();  // Correct method to request camera permissions
      setHasPermission(status === 'granted');  // Check if permission was granted
    })();
  }, []);

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

  const handleBarcodeScanned = ({ type, data }) => {
    console.log('Scanned barcode data:', data);
    setScannerActive(false);
    // Here you can call your Open Food Facts barcode endpoint with the scanned data
    axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
      .then(response => {
        console.log('Scanned product:', response.data.product);
        // You can update your foodItems with the scanned product data
      })
      .catch(error => {
        console.error('Error scanning barcode:', error);
      });
  };

  // If scanner is active, show the camera view
  if (scannerActive) {
    if (hasPermission === null) {
      return <Text>Requesting camera permission...</Text>; // Requesting permission status
    }

    if (hasPermission === false) {
      return <Text>No access to camera</Text>;  // If no permission granted
    }

    return (
      <View style={styles.scannerContainer}>
        <Camera
          type={Camera.Type.back}  // Use Camera.Type.back instead of Camera.Constants.Type.back
          onBarCodeScanned={handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <Ionicons 
            onPress={() => setScannerActive(false)} 
            name="close" 
            size={24} 
            color="black" 
            style={{ position: "absolute", right: 10, top: 10 }} 
          />
        </Camera>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Search food...'
            style={styles.input}
          />
          <Ionicons onPress={() => setScannerActive(true)} name="barcode-outline" size={32} color="black" />
        </View>
        <TouchableOpacity onPress={performSearch} style={styles.searchIcon}>
          <Icon name="search" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={foodItems}
          renderItem={({ item }) => (
            <FoodListItem item={item} showAddButton={true} />  // This should render a custom component for each food item
          )}
          ListEmptyComponent={() => <Text>Search any food</Text>}
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
    flex: 1,
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
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
