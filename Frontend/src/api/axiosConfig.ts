import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5206',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized (token expired)
            if (error.response.status === 401) {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
            }

            // Handle other common errors
            const message = error.response.data?.message || 'Something went wrong';
            console.error(`API Error [${error.response.status}]:`, message);
        }
        return Promise.reject(error);
    }
);

export default api;
