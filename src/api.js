import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');

let api = axios.create({
  // baseURL: process.env.REACT_APP_URL,
  baseURL: 'http://localhost:3003',
  headers: {
    // 'Content-Type': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export default api;
