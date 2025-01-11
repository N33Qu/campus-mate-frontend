import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import teamService from '@/services/teamService';

export function useTeam() {
    const teams = ref([]);
    const selectedTeams = ref([]);
    const isLoading = ref(false);
    const toast = useToast();

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

    const resetSelection = () => {
        selectedTeams.value = [];
    };

    return {
        teams,
        selectedTeams,
        isLoading,
        fetchTeams,
        resetSelection
    };
}