import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

export const usePermissions = () => {
    const authStore = useAuthStore();

    const isAdmin = computed(() => {
        return authStore.userRole === 'ROLE_ADMIN' ?? false;
    });

    return {
        isAdmin,
    };
};