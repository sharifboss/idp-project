import axios from 'axios';
import { auth } from './firebase/firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken(true); // Force refresh if expired
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  } else {
    console.warn('No user logged in!');
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;