import { Stack } from 'expo-router';
import { AuthProvider, useAuthContext } from './AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthenticatedStack = () => (
  <Stack
    screenOptions={{
      headerShown: false,
    }}
  />
);

const RootLayout = () => {
  const { user } = useAuthContext();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.gender) {
            setInitialRoute('/gender');
          } else if (!userData.experience) {
            setInitialRoute('/experience');
          } else if (!userData.weight) {
            setInitialRoute('/weightInput');
          } else {
            setInitialRoute('/home');
          }
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

  return <AuthenticatedStack />;
};

const App = () => (
  <AuthProvider>
    <RootLayout />
  </AuthProvider>
);

export default App;
