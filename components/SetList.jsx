import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React from 'react';
import axios from 'axios';
import SetListItem from './SetListItem';
import ProgressGraph from './ProgressGraph';
import { useAuthContext } from '../app/AuthProvider';

const SetsList = ({ exerciseId }) => {
  const { user } = useAuthContext();
  const [setsData, setSetsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get(`https://fitness-one-server.onrender.com/history/${user._id}`);
        setSetsData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };

    fetchSets();
  }, [user, exerciseId]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {/* You can replace this with your actual header content */}
      <ProgressGraph sets={setsData} /> 

      <FlatList
        data={setsData}
        keyExtractor={(item) => item._id.toString()} // Assuming item._id exists
        renderItem={({ item }) => <SetListItem set={item} />}
      />
    </View>
  );
};

export default SetsList;
