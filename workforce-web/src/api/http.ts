import axios, { AxiosHeaders } from 'axios';

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (baseUrl && baseUrl.trim().length > 0) ? baseUrl.replace(/\/+$/, '') : 'http://localhost:8080';
}

export const http = axios.create({
  baseURL: getApiBaseUrl(),
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers ?? new AxiosHeaders();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  config.headers.set('Accept', 'application/json');
  return config;
});
