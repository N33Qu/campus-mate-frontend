import api from '@/config/axiosConfig.js';

export const authService = {
    async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    }
};