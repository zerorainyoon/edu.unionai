import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Dynamic API URL detection: relative path for production, localhost for development
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If not running on localhost, use the relative path (proxied via Nginx)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api/v1';
    }
  }
  return 'http://localhost:18000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
const TIMEOUT_MS = 10000; // 10 seconds

// Custom Axios Instance Setup
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Run preprocessing (e.g. inject tokens, logging, localize headers)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Inject Authorization token if present in localStorage
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Format output and standardize error tracking
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the nested data payload directly for simpler usage
    return response;
  },
  (error: AxiosError) => {
    // Global Error Handling Logic
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      console.warn('Unauthorized request! Redirecting or clearing credentials...');
      // e.g. localStorage.removeItem('auth_token');
    } else if (status === 403) {
      console.error('Forbidden access!');
    } else if (status === 404) {
      console.error('Requested resource not found:', error.config?.url);
    } else if (status && status >= 500) {
      console.error('Internal Server Error. Please contact administrator.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out.');
    } else {
      console.error('Network or Unknown API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Scalable, generic HTTP Wrapper helpers to abstract Axios usage in components/services
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((response: AxiosResponse<T>) => response.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, data, config).then((response: AxiosResponse<T>) => response.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, data, config).then((response: AxiosResponse<T>) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((response: AxiosResponse<T>) => response.data),
};

export default apiClient;
