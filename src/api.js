import axios from 'axios';

let api = axios.create({
  baseURL:'http://localhost:3002',
  headers: { 'Content-Type': 'application/json' },
})

export default api;
