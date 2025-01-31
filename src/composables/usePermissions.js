import { useAuthStore } from '@/stores/authStore.js';

export function usePermissions() {
    const authStore = useAuthStore();

    const canView = () => {
        return ['ROLE_STUDENT', 'ROLE_LECTURER'].includes(authStore.userRole);
    };

    const canManage = () => {
        return ['ROLE_LECTURER'].includes(authStore.userRole);
    };

    const canEdit = () => {
        return authStore.userRole === 'ROLE_LECTURER';

    };

    const canDelete = () => {
        return authStore.userRole === 'ROLE_LECTURER';

    };

    const canCreate = () => {
        return ['ROLE_LECTURER'].includes(authStore.userRole);
    };

    return {
        canView,
        canManage,
        canEdit,
        canDelete,
        canCreate
    };
}