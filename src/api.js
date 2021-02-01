import axios from 'axios';

let api = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: {
    // 'Content-Type': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export default api;
