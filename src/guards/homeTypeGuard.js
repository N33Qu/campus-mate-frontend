import { useAuthStore } from '@/stores/authStore'

export const homeTypeGuard = (to, from) => {
    const authStore = useAuthStore()
    const role = authStore.userRole

    if (role === 'ROLE_ADMIN') {
        return { name: 'adminPanel' }
    }

    return true
}