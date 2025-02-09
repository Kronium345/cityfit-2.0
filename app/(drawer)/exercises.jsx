import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';

const Exercises = () => {
  const [exercises, setExercises] = useState([]); // All exercises
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);  // To show loading spinner when fetching
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(null);  // Store the offset for pagination
  const pageSize = 10; // 10 items per page
  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, [page]);

  const fetchExercises = async () => {
    setLoading(true); // Start loading
    try {
      const params = {
        pageSize: pageSize, // Set the page size
        ...(offset && { offset }), // Use the offset if available
      };

      // Fetching exercises data from Airtable
      const response = await axios.get(
        `https://api.airtable.com/v0/${process.env.EXPO_PUBLIC_AIRTABLE_BASE_ID}/${process.env.EXPO_PUBLIC_AIRTABLE_TABLE_ID}`, 
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_AIRTABLE_PAT}`,
          },
          params: params,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.records) {
        // Log the results to check what they look like
        console.log("Full Results:", response.data.records);

        // Set exercises directly without filtering
        setExercises(prevExercises => [...prevExercises, ...response.data.records]);  // Add the new exercises

        // Update offset if available
        setOffset(response.data.offset);
      } else {
        console.log("No results found in the API response.");
      }
    } catch (error) {
      console.error("Fetching exercises failed:", error);
    } finally {
      setLoading(false);  // End loading
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
        modifications: exercise.fields.Modifications || 'No modifications available',
      }
    });
  };

  // Filter exercises based on search term
  const searchFilteredExercises = exercises.filter(exercise =>
    exercise.fields.Exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#004d00', '#003300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#rgba(255, 255, 255, 0.6)"
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
            <Button title="More" onPress={() => setPage(page + 1)} color="#007AFF" />
          </View>
        </View>
      </LinearGradient>

      {/* Add the custom tab bar at the bottom */}
      <CustomTabBar />
    </View>
  );
};

const CustomTabBar = () => {
  const router = useRouter();

  return (
    <BlurView
      intensity={20}
      tint=""
      style={styles.tabBar}
    >
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/(drawer)/(tabs)/more')}
      >
        <Feather name="more-horizontal" size={25} color="#fff" />
        <Text style={[styles.tabLabel, styles.activeTab]}>More</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/(drawer)/(tabs)/planScreen')}
      >
        <Feather name="plus" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/(drawer)/(tabs)/home')}
      >
        <Feather name="home" size={24} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/(drawer)/(tabs)/chartScreen')}
      >
        <Feather name="bar-chart" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Charts</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => router.push('/(drawer)/(tabs)/profileScreen')}
      >
        <Feather name="user" size={25} color="rgba(255, 255, 255, 0.6)" />
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  searchBar: {
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    elevation: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
  },
  tabLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTab: {
    color: '#fff',
  },
});

export default Exercises;
