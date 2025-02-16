import 'dotenv/config'; // To load variables from .env

export default {
  expo: {
    name: 'city-fit-2.0',
    slug: 'city-fit-2.0',
    version: '2.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: [
        "android.permission.ACTIVITY_RECOGNITION",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
      package: 'com.kronium.cityfit2.x0',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-audio',
      'react-native-health-connect',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      cohereApiKey: process.env.EXPO_PUBLIC_COHERE_API_KEY, // Reference to your Cohere key
    },
  },
};
