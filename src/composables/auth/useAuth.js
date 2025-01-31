import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useToastStore } from '@/stores/toastStore.js';
import { useToast } from 'vue-toastification';
import { authService } from '@/services/authService.js';
import router from '@/router/router.js';

export function useAuth() {
    const authStore = useAuthStore();
    const toastStore = useToastStore();
    const toast = useToast();
    const isLoading = ref(false);
    const error = ref(null);

    const handleLogin = async (credentials) => {
        isLoading.value = true;
        error.value = null;

        try {
            await authService.login(credentials);
            authStore.login();
            await router.push('/');
            await location.reload();
            toastStore.setToast("Zalogowano pomyślnie!", "success");
        } catch (err) {
            error.value = err.response?.status === 403 ? 'Złe dane logowania' : 'Błąd logowania';
            toast.error(error.value);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const handleLogout = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            await authService.logout();
            authStore.logout();
            await router.push('/');
            await location.reload();
            toastStore.setToast("Wylogowano pomyślnie!", "success");
        } catch (err) {
            error.value = 'Błąd wylogowania';
            toastStore.setToast('Błąd wylogowania ', "error");
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        login: handleLogin,
        logout: handleLogout
    };
}