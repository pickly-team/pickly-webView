require('dotenv/config');

export default {
  expo: {
    name: 'Pickly',
    slug: 'pickly',
    version: '1.1.3',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'picklyapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#50A973',
    },
    updates: {
      url: 'https://u.expo.dev/2ff1c8d5-ce1d-47d7-86d7-ebe5d015089a',
    },
    runtimeVersion: '1.1.3',
    assetBundlePatterns: ['**/*'],
    notification: {
      icon: './assets/images/notification-icon.png',
    },
    ios: {
      bundleIdentifier: 'com.ww8007.pickly',
      buildNumber: '12',
    },
    android: {
      package: 'com.ww8007.pickly',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    extra: {
      eas: {
        projectId: '2ff1c8d5-ce1d-47d7-86d7-ebe5d015089a',
      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      expoClientId: process.env.EXPO_CLIENT_ID,
      iosClientId: process.env.IOS_CLIENT_ID,
      androidClientId: process.env.ANDROID_CLIENT_ID,
      serverEndpoint: process.env.SERVER_ENDPOINT,
      clientUrl: process.env.CLIENT_URL,
    },
    plugins: [
      '@react-native-firebase/app',
      '@react-native-google-signin/google-signin',
    ],
    owner: 'ww8007',
  },
};
