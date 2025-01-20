import api from '@/config/axiosConfig';

export const userService = {
    async getUserPosts(userId) {
        return await api.get(`user/${userId}/posts`);
    },

    async getUserTeams(userId) {
        return await api.get(`user/${userId}/teams`);
    },

    async getUser(userId) {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    },

    async updateUser(userId, userData) {
        const response = await api.patch(`/user/${userId}`, userData);
        return response.data;
    },

    async updatePassword(userId, passwordData) {
        const response = await api.post(`auth/change-password/${userId}`, passwordData);
        return response.data;
    },

    async getAllUsersByRole(role) {
        const response = await api.get(`/user/role/${role}`);
        return response.data;
    },

    async deleteUser(userId) {
        const response = await api.delete(`/user/${userId}`)
        return response.data;
    },

    async getAllUsers() {
        const response = await api.get('/user');
        return response.data;
    },

    async createUser(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },


    //TODO: poprawić response.error
}
