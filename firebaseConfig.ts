import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: Constants.expoConfig?.extra?.apiKey || '',
  authDomain: Constants.expoConfig?.extra?.authDomain || '',
  projectId: Constants.expoConfig?.extra?.projectId || '',
  storageBucket: Constants.expoConfig?.extra?.storageBucket || '',
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId || '',
  appId: Constants.expoConfig?.extra?.appId || '',
  measurementId: Constants.expoConfig?.extra?.measurementId || '',
};

// Validate environment variables
function validateEnv(config: FirebaseOptions) {
  if (!config.apiKey) {
    throw new Error(`Missing environment variable: apiKey`);
  }
  if (!config.authDomain) {
    throw new Error(`Missing environment variable: authDomain`);
  }
  if (!config.projectId) {
    throw new Error(`Missing environment variable: projectId`);
  }
  if (!config.storageBucket) {
    throw new Error(`Missing environment variable: storageBucket`);
  }
  if (!config.messagingSenderId) {
    throw new Error(`Missing environment variable: messagingSenderId`);
  }
  if (!config.appId) {
    throw new Error(`Missing environment variable: appId`);
  }
  if (!config.measurementId) {
    throw new Error(`Missing environment variable: measurementId`);
  }
}

validateEnv(firebaseConfig);

export const startApp = initializeApp(firebaseConfig);
