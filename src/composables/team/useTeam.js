import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { teamValidationSchema } from '@/validation/teamValidation';
import { teamService } from '@/services/teamService';

export function useTeam(teamId = null) {
    const router = useRouter();
    const toast = useToast();
    const team = ref(null);
    const users = ref([]);
    const posts = ref([]);
    const isLoading = ref(false);
    const showEditModal = ref(false);
    const showAddUsersModal = ref(false);
    const showDeleteConfirmation = ref(false);
    const searchQuery = ref('');

    const { handleSubmit, errors, values, setFieldValue } = useForm({
        validationSchema: teamValidationSchema
    });

    const filteredUsers = computed(() => {
        if (!searchQuery.value) return users.value;
        const query = searchQuery.value.toLowerCase();
        return users.value.filter(user =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query)
        );
    });

    const fetchTeamData = async () => {
        if (!teamId) return;
        isLoading.value = true;
        try {
            const [teamResponse, usersResponse, postsResponse] = await Promise.all([
                teamService.getTeam(teamId),
                teamService.getTeamUsers(teamId),
                teamService.getTeamPosts(teamId)
            ]);
            team.value = teamResponse.data;
            users.value = usersResponse.data;
            posts.value = postsResponse.data;
        } catch (error) {
            toast.error('Bład podczas pobierania danych zespołu');
            console.error('Error:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const updateTeam = async (data) => {
        try {
            await teamService.updateTeam(teamId, data);
            await fetchTeamData();
            showEditModal.value = false;
            toast.success('Zespół zaktualizowany pomyślnie');
        } catch (error) {
            toast.error('Błąd podczas aktualizacji zespołu');
            console.error('Error:', error);
        }
    };

    const removeUser = async (userId) => {
        try {
            await teamService.removeUserFromTeam(teamId, userId);
            await fetchTeamData();
            toast.success('Użytkownik usunięty z zespołu');
        } catch (error) {
            toast.error('Błąd podczas usuwania użytkownika');
            console.error('Error:', error);
        }
    };

    const deleteTeam = async () => {
        try {
            await teamService.deleteTeam(teamId);
            toast.success('Zespoł usunięty pomyślnie');
            await router.push('/teams');
        } catch (error) {
            toast.error('Bład podczas usuwania zespołu');
            console.error('Error:', error);
        }
    };

    return {
        team,
        users,
        posts,
        isLoading,
        showEditModal,
        showAddUsersModal,
        showDeleteConfirmation,
        searchQuery,
        filteredUsers,
        errors,
        values,
        setFieldValue,
        fetchTeamData,
        updateTeam,
        removeUser,
        deleteTeam,
        handleSubmit
    };
}