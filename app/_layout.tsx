import { Stack } from 'expo-router';
import AuthProvider, { useAuthContext } from '../app/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootLayout = () => {
  const { user } = useAuthContext(); 
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setInitialRoute('/');
          return;
        }

        try {
          const response = await axios.get(`http://192.168.1.48:5000/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = response.data;

          if (!userData.gender) {
            setInitialRoute('/gender');
          } else if (!userData.experience) {
            setInitialRoute('/experience');
          } else if (!userData.weight) {
            setInitialRoute('/weightInput');
          } else {
            setInitialRoute('/tabs/home');
          }
        } catch (error) {
          setInitialRoute('/');
        }
      } else {
        setInitialRoute('/');
      }
    };

    checkUser();
  }, [user]);

  useEffect(() => {
    if (initialRoute) {
      router.push(initialRoute);
    }
  }, [initialRoute]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
    </Stack>
  );
};

const App = () => (
  <AuthProvider>
    <RootLayout />
  </AuthProvider>
);

export default App;
