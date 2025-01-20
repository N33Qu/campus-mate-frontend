import router from '@/router/router.js';
import { useAuthStore } from '@/stores/authStore';

export const setupAuthInterceptor = (api) => {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const authStore = useAuthStore();
            if (error.response?.status === 401) {
                authStore.logout();
                await router.push('/login');
                return Promise.reject(error);
            }
        }
    );
};