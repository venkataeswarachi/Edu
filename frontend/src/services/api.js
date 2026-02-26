import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4210/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Direct connection to the Python AI service (no Spring Boot proxy)
export const aiApi = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000, // 60s — LLM can be slow
});

export default api;