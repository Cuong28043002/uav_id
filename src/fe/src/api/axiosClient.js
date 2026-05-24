import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.20:5000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
        // Trigger auto-logout across the app
        DeviceEventEmitter.emit('AUTH_UNAUTHORIZED');
      } catch (storageError) {
        console.error(storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

