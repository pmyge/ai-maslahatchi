import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Interceptor for JWT tokens
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            // You could implement refresh token logic here
            // For now, redirect to login if unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
