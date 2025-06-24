import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mern-ethiopian-recipes.onrender.com',
  withCredentials: true,            
});

export default api;
