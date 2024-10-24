import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon package
import FoodListItem from '../components/FoodListItem';

const foodItems = [
  { label: 'Pizza', cal: 75, brand: 'Dominos' },
  { label: 'Apple', cal: 50, brand: 'Generic' },
  { label: 'Coffee', cal: 100, brand: 'Costa' }
];

const foodHomeScreen = () => {
  const [search, setSearch] = useState('');

  const performSearch = () => {
    console.warn('Searching for: ', search);
    setSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search...'
          style={styles.input}
        />
        <TouchableOpacity onPress={performSearch} style={styles.searchIcon}>
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodItems}
        renderItem={({ item }) => <FoodListItem item={item} />}
        contentContainerStyle={{ gap: 5 }}
      />
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
