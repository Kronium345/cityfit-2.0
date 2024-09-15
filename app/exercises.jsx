import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 50;
  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, [page]);

  const fetchExercises = async () => {
    try {
      const offset = page * pageSize;
      const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/?status=2&language=2&limit=${pageSize}&offset=${offset}`);
      if (response.data && response.data.results) {
        const newExercises = response.data.results.filter(ex => ex.images.length > 0 && ex.images[0].image.endsWith('.gif'));
        setExercises(prevExercises => [...prevExercises, ...newExercises]);
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
        id: exercise.id.toString(),  // Make sure ID is a string
        name: exercise.name,
        description: exercise.description || 'No description available',
        image: exercise.images[0].image,
        videoUrl: exercise.youtubeUrl
      },
    });
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.searchBar}
        onChangeText={handleSearch}
        value={searchTerm}
      />
      <FlatList
        data={exercises.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectExercise(item)}>
            <Image source={{ uri: item.images[0].image }} style={styles.thumbnail} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      <Button title="Load More" onPress={() => setPage(page + 1)} color="#007AFF" />
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
});

export default Exercises;
