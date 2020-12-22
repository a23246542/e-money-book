import axios from 'axios';

let api = axios.create({
  baseURL:'https://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

export default api;
