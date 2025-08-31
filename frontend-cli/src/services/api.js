import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4500',
  withCredentials: true // ← THIS IS CRUCIAL for cookies
});

export default API;