import api from '@/config/axiosConfig';

class TeamService {
    async getTeams() {
        return api.get('/team');
    }

    async getTeamPosts(teamId) {
        return api.get(`/team/${teamId}/posts`);
    }
}

export default new TeamService();