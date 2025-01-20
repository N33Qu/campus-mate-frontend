import api from '@/config/axiosConfig';

export const teamService = {
    async getTeams() {
        return api.get('/team');
    },

    async getTeam(teamId) {
        return api.get(`/team/${teamId}`);
    },

    async createTeam(teamData) {
        return api.post('/team', teamData);
    },

    async updateTeam(teamId, teamData) {
        return api.patch(`/team/${teamId}`, teamData);
    },

    async deleteTeam(teamId) {
        return api.delete(`/team/${teamId}`);
    },

    async getTeamUsers(teamId) {
        return api.get(`/team/${teamId}/users`);
    },

    async getTeamPosts(teamId) {
        return api.get(`/team/${teamId}/posts`);
    },

    async addUsersToTeam(teamId, userIds) {
        console.log(userIds);
        return api.post(`/team/${teamId}/addUsers`, { userIds });
    },

    async removeUserFromTeam(teamId, userId) {
        return api.delete(`/team/${teamId}/removeUser/${userId}`);
    },

    async getAvailableUsers(teamId) {
        return api.get(`/team/${teamId}/available-users`);
    }
};