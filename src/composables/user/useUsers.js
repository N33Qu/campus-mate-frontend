import { ref } from 'vue'
import { userService } from '@/services/userService'
import { useToast } from 'vue-toastification'

export function useUsers() {
    const users = ref([])
    const selectedUser = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const toast = useToast()

    const fetchUsers = async () => {
        try {
            isLoading.value = true
            users.value = await userService.getAllUsers();

        } catch (err) {
            error.value = err.message
            toast.error('Błąd podczas pobierania użytkowników')
        } finally {
            isLoading.value = false
        }
    }

    const createUser = async (userData) => {
        try {
            const newUser = await userService.createUser(userData)
            users.value.push(newUser)
            toast.success('Użytkownik utworzony pomyślnie')
            return newUser
        } catch (err) {
            error.value = err.message
            toast.error('Błąd podczas tworzenia użytkownika')
            throw err
        }
    }

    const deleteUser = async (userId) => {
        try {
            await userService.deleteUser(userId)
            users.value = users.value.filter(user => user.userId !== userId)
            toast.success('Użytkownik usunięty pomyślnie')
        } catch (err) {
            error.value = err.message
            toast.error('Błąd podczas usuwania użytkownika')
        }
    }

    const updateUser = async (userId, userData) => {
        try {
            await userService.updateUser(userId, userData)
            const index = users.value.findIndex(user => user.userId === userId)
            if (index !== -1) {
                users.value[index] = { ...users.value[index], ...userData }
            }
            toast.success('Użytkownik zaaktualizowany pomyślnie')
        } catch (err) {
            error.value = err.message
            toast.error(err.message)
        }
    }

    const getUserDetails = async (userId) => {
        try {
            const userDetails = await userService.getUser(userId)
            selectedUser.value = userDetails
            return userDetails
        } catch (err) {
            error.value = err.message
            toast.error(err.message)
        }
    }

    const clearSelectedUser = () => {
        selectedUser.value = null
    }

    return {
        users,
        selectedUser,
        isLoading,
        error,
        fetchUsers,
        createUser,
        deleteUser,
        updateUser,
        getUserDetails,
        clearSelectedUser
    }
}