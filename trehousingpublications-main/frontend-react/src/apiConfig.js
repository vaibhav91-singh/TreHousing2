import axios from 'axios';

// Live Render Backend Base URL
const API_BASE_URL = 'https://trehousing2.onrender.com';

axios.defaults.baseURL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
