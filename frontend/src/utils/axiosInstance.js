import axios from "axios";

const instance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'http://localhost:5000/api',   
});

// Add request interceptor to add token to headers
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(config);
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
