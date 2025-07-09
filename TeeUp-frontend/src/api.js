import axios from 'axios';
import { API_BASE_URL } from '@env';

// 로그 찍기
console.log("url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
