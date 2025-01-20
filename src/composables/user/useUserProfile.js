import { ref, reactive } from 'vue';
import { userService } from '@/services/userService';

export function useUserProfile(userId) {
    const isLoading = ref(false);
    const error = ref(null);
    const profile = reactive({
        firstName: '',
        lastName: '',
        email: ''
    });

    const fetchProfile = async () => {
        try {
            isLoading.value = true;
            error.value = null;
            const data = await userService.getUser(userId);
            console.log(data)
            Object.assign(profile, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                group: data.group
            });
        } catch (err) {
            error.value = 'Błąd pobierania profilu';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            isLoading.value = true;
            error.value = null;
            await userService.updateUser(userId, profileData);
            Object.assign(profile, profileData);
            return true;
        } catch (err) {
            error.value = 'Błąd edycji profilu';
            console.error(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const updatePassword = async (passwordData) => {
        try {
            isLoading.value = true;
            error.value = null;
            await userService.updatePassword(userId, passwordData);
            return true;
        } catch (err) {
            error.value = 'Błąd zmiany hasła';
            console.error(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        profile,
        isLoading,
        error,
        fetchProfile,
        updateProfile,
        updatePassword
    };
}