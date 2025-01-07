import router from '@/router/router.js';
import { useAuthStore } from '@/stores/authStore';

export const setupAuthInterceptor = (api) => {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                const authStore = useAuthStore();
                authStore.logout();
                await router.push('/login');
                return Promise.reject(error);
            }
            return Promise.reject(error);
        }
    );
};