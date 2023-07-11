import axios from 'axios';
import Constants from 'expo-constants';

const client = axios.create({
  baseURL: Constants.expoConfig?.extra?.serverEndpoint,
});

export default client;
