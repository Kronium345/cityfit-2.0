import { Stack } from 'expo-router';
import AuthProvider, { useAuthContext } from '../app/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const RootLayout = () => {
  const { user } = useAuthContext(); 
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [loaded, error] = useFonts({
    // ... existing fonts
  });

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setInitialRoute('/');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`http://192.168.1.216:5000/user/${user._id}`, {
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
            setInitialRoute('/(drawer)/(tabs)/home');
          }
        } catch (error) {
          setInitialRoute('/');
        }
      } else {
        setInitialRoute('/');
      }

      setLoading(false);
    };

    checkUser();
  }, [user]);

  useEffect(() => {
    if (initialRoute) {
      router.push(initialRoute);
    }
  }, [initialRoute]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loading) {
    return <Text>Loading...</Text>;  // Simple loading message or you could use a spinner here
  }

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
};

const App = () => (
  <AuthProvider>
    <RootLayout />
  </AuthProvider>
);

export default App;
