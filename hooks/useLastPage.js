import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLastPage = () => {
  const router = useRouter();

  useEffect(() => {
    const saveLastPage = async () => {
      const currentRoute = router.getCurrentRoute();
      if (currentRoute) {
        await AsyncStorage.setItem('lastPage', currentRoute.name);
      }
    };

    const unsubscribe = router.listen(saveLastPage);

    return () => {
      unsubscribe();
    };
  }, [router]);

  return null;
};

export default useLastPage;
