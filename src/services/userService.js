import api from '@/config/axiosConfig';

export const userService = {
    async getUserPosts(userId) {
        return api.get(`user/${userId}/posts`);
    },

    async getProfile(userId) {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    },

    async updateProfile(userId, userData) {
        const response = await api.patch(`/user/${userId}`, userData);
        return response.data;
    },

    async updatePassword(userId, passwordData) {
        const response = await api.post(`auth/change-password/${userId}`, passwordData);
        return response.data;
    },

    async getAllStudents() {
        const response = await api.get('/user/role/ROLE_STUDENT');
        return response.data;
    }
}
