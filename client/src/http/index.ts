import axios from 'axios';

export const API_ARL = 'http://localhost:5000/api';

const $api = axios.create({
  // add cookie for all req
  withCredentials: true,
  baseURL: API_ARL,
});

$api.interceptors.request.use((config) => {
  // add Authorization access token for all req
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

export default $api;
