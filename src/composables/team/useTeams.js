import { ref } from 'vue';
import {teamService} from '@/services/teamService';
import {userService} from "@/services/userService.js";

export function useTeams() {
    const teams = ref([]);
    const selectedTeams = ref([]);
    const isLoading = ref(false);

    const fetchTeams = async () => {
        isLoading.value = true;
        try {
            const response = await teamService.getTeams();
            teams.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching teams', error);
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchUserTeams = async (userId) => {
        isLoading.value = true;
        try {
            const response = await userService.getUserTeams(userId);
            if (!response) return
            teams.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching teams', error);
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    const resetSelection = () => {
        selectedTeams.value = [];
    };

    return {
        teams,
        selectedTeams,
        isLoading,
        fetchTeams,
        resetSelection,
        fetchUserTeams
    };
}