import axios from 'axios';

let api = axios.create({
  baseURL:'',
  headers: { 'Content-Type': 'application/json' },
})

export default api;
