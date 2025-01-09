import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } from '@env';

const Exercises = () => {
  const [exercises, setExercises] = useState([]); // All exercises
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10; // 10 items per page
  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, [page]);

  const fetchExercises = async () => {
    try {
      const offset = page * pageSize;
      console.log(`Fetching data from offset: ${offset} and page size: ${pageSize}`);

      // Fetching exercises data from Airtable
      const response = await axios.get(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
        },
        params: {
          pageSize: pageSize, // Set the page size (number of records per request)
          offset: offset, // Pagination support (if needed)
        },
      });

      console.log("API Response:", response.data);

      if (response.data.records) {
        // Log the results to check what they look like
        console.log("Full Results:", response.data.records);

        // Set exercises directly without filtering
        setExercises(prevExercises => [...prevExercises, ...response.data.records]);  // Add the new exercises
      } else {
        console.log("No results found in the API response.");
      }
    } catch (error) {
      console.error("Fetching exercises failed:", error);
    }
  };

  const handleSearch = text => {
    setSearchTerm(text);
  };

  const handleSelectExercise = (exercise) => {
    router.push({
      pathname: '/exerciseDetails',
      params: {
        id: exercise.id,
        name: exercise.fields.Exercise,  // Assuming 'Exercise' is the field for exercise names
        description: exercise.fields.Notes || 'No description available',
        image: exercise.fields.Example ? exercise.fields.Example[0].url : null,  // Access the URL directly
        equipment: exercise.fields.Equipment || 'Not specified', // Exercise equipment
        exerciseType: exercise.fields['Exercise Type'] || 'Not specified',  // Exercise type
        majorMuscle: exercise.fields['Major Muscle'] || 'Not specified',  // Major muscle
        minorMuscle: exercise.fields['Minor Muscle'] || 'Not specified',  // Minor muscle
        modifications: exercise.fields.Modifications || 'No modifications available'
      }
    });
  };

  // Filter exercises based on search term
  const searchFilteredExercises = exercises.filter(exercise =>
    exercise.fields.Exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.searchBar}
        onChangeText={handleSearch}
        value={searchTerm}
      />
      <FlatList
        data={searchFilteredExercises} // Display all exercises
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          console.log("Rendering item:", item);

          // Extract image URL from the Example field
          const imageUrl = item.fields.Example && item.fields.Example[0] ? item.fields.Example[0].url : null;
          console.log("Image URL:", imageUrl);  // Check the constructed image URL

          return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectExercise(item)}>
              {imageUrl ? (
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.thumbnail} 
                />
              ) : (
                <Text>No Image Available</Text>
              )}
              <Text style={styles.itemText}>{item.fields.Exercise}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
      {/* Pagination buttons */}
      <View style={styles.pagination}>
        {page > 0 && (
          <Button title="Previous" onPress={() => setPage(page - 1)} color="#007AFF" />
        )}
        <Button title="Next" onPress={() => setPage(page + 1)} color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Exercises;
