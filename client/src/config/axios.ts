import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('retry')
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      //const refreshToken="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJCaXNoYWwiLCJpYXQiOjE3MTg5NTAyMjAsImV4cCI6MTcxOTU1NTAyMH0.0hzgJLbKQ4Omw7oQ1bbfwWlmOHH4zquOGASVWbDrRCM"
      if (refreshToken) {
        try {
          const { data } = await axios.post('http://localhost:8080/refresh-token', { refreshToken });
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Handle token refresh failure (e.g., logout user)
        }
      }
    }
    return Promise.reject(error);
  }
);