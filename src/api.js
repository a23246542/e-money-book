import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');

let api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'test'
      ? 'http://localhost:3003'
      : process.env.REACT_APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
