import { useEffect } from 'react';
import { useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useTrackRoute = () => {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const saveCurrentRoute = async () => {
      // Ensure that the navigationRef is properly initialized and accessible
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          await AsyncStorage.setItem('lastPage', currentRoute.name);
        }
      }
    };

    const unsubscribe = navigationRef.addListener('state', saveCurrentRoute);

    return () => {
      unsubscribe();
    };
  }, [navigationRef]);

  return navigationRef;
};

export default useTrackRoute;
