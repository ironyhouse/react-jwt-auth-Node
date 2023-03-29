import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

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

// update refresh and access tokens
$api.interceptors.response.use(
  // if token valid => return config
  (config) => {
    return config;
  },
  // else get new tokens and repeat previous request
  async (error) => {
    // save previous request
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      // error.config, error.config._isRetry - to avoid looping if statues is again 401
      originalRequest._isRetry = true;
      try {
        // get new tokens
        const response = await axios.get<AuthResponse>(`${API_ARL}/refresh`, {
          withCredentials: true,
        });

        // set new token
        localStorage.setItem('token', response.data.accessToken);

        // repeat previous request
        return $api.request(originalRequest);
      } catch (e) {
        console.error('User is not authorized.');
      }

      // if status !== 401
      throw error;
    }
  }
);

export default $api;
