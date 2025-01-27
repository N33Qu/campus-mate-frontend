import { useAuthStore } from '@/stores/authStore';

export function useAddressBookPermissions() {
    const authStore = useAuthStore();

    const canViewEntries = () => {
        return ['ROLE_STUDENT', 'ROLE_LECTURER', 'ROLE_ADMIN'].includes(authStore.userRole);
    };

    const canEditEntry = (entryUserId) => {
        if (authStore.userRole === 'ROLE_ADMIN') {
            return true;
        }
        if (authStore.userRole === 'ROLE_LECTURER') {
            return entryUserId === authStore.userId;
        }
        return false;
    };

    const canDeleteEntry = () => {
        return authStore.userRole === 'ROLE_ADMIN';
    };

    return {
        canViewEntries,
        canEditEntry,
        canDeleteEntry
    };
}