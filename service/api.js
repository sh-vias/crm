// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.magicqr.in/public/api';

let inMemoryToken = null; // <- Global in-memory token

const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Attach token to each request
api.interceptors.request.use(
   async (config) => {
      // Optional fallback to AsyncStorage
      if (!inMemoryToken) {
         try {
            inMemoryToken = await AsyncStorage.getItem('authToken');
         } catch (e) {
            console.warn("Error reading token:", e);
         }
      }
      if (inMemoryToken) {
         config.headers.Authorization = `Bearer ${inMemoryToken}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Login function
export const LoginUser = async (data) => {
   try {
      const response = await api.post('sign-in', data);
      const token = response.data?.data?.token;

      if (token) {
         inMemoryToken = token; // Set global token
         await AsyncStorage.setItem('authToken', token);
         console.log('Token saved successfully');
      } else {
         console.warn('No token received from response');
      }

      return response.data;
   } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
   }
};

// Get user data
export const getUser = async (data) => {
   try {
      const response = await api.post(`/get-user-list`, data);
      return response.data;
   } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
   }
};
export const getUserDiscussionList = async (data) => {
   try {
      const response = await api.post(`/get-cust-response-list`, data);
      return response.data;
   } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
   }
};
export const getUserfollow = async (data) => {
   try {
      const response = await api.post(`/get-cust-response-list`, data);
      return response.data;
   } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
   }
};
export const getUserDiscussionLists = async (data) => {
   try {
      const response = await api.post(`/get-discussion-list`, data);
      return response.data;
   } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
   }
};
export default api;
