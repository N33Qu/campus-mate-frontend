import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function usePermissions() {
    const authStore = useAuthStore()
    const userRole = computed(() => authStore.userRole)
    const userId = computed(() => authStore.userId)

    const canEdit = computed(() => userRole.value === 'ROLE_LECTURER')
    const canView = computed(() => ['ROLE_STUDENT', 'ROLE_LECTURER'].includes(userRole.value))

    const validateEdit = () => {
        if (!canEdit.value) {
            throw new Error('Brak uprawnień do edycji wydarzeń')
        }
    }

    const validateView = () => {
        if (!canView.value) {
            throw new Error('Brak uprawnień do wyświetlania wydarzeń')
        }
    }

    return {
        canEdit,
        canView,
        userRole,
        userId,
        validateEdit,
        validateView
    }
}