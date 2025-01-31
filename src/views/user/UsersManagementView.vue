<script setup>
import { ref, onMounted } from 'vue'
import UserModal from '@/components/user/UserModal.vue'
import UserForm from '@/components/user/UserForm.vue'
import UserDetails from '@/components/user/UserDetails.vue'
import { useUsers } from '@/composables/user/useUsers'
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal.vue";
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const {
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
} = useUsers()

const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const isEditMode = ref(false)

onMounted(() => {
  fetchUsers()
})

const openAddModal = () => {
  clearSelectedUser()
  isEditMode.value = false
  showFormModal.value = true
}

const openEditModal = (user) => {
  selectedUser.value = user
  isEditMode.value = true
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  clearSelectedUser()
  isEditMode.value = false
}

const openUserDetails = async (user) => {
  await getUserDetails(user.userId)
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  clearSelectedUser()
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const handleDelete = async () => {
  if (userToDelete.value) {
    await deleteUser(userToDelete.value.userId)
    await fetchUsers()
    closeDeleteModal()
  }
}

const handleSubmit = async (formData, callbacks) => {
  try {
    if (isEditMode.value && selectedUser.value) {
      await updateUser(selectedUser.value.userId, formData)
    } else {
      await createUser(formData)
    }
    await fetchUsers()
    callbacks.onSuccess()
    closeFormModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    callbacks.onError()
  }
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'ROLE_STUDENT': 'bg-green-100 text-green-800',
    'ROLE_LECTURER': 'bg-blue-100 text-blue-800',
    'ROLE_ADMIN': 'bg-violet-100 text-violet-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="p-6 bg-element rounded-lg m-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Zarządzanie użytkownikami</h1>
      <button
          @click="openAddModal"

      >
        <i class="pi pi-user-plus  mr-2 text-2xl text-addButton hover:text-addButtonHover"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white shadow-md rounded-lg">
      <div class="max-h-[calc(100vh-240px)] overflow-y-auto">
        <table class="w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imię i nazwisko
            </th>
            <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Email
            </th>
            <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rola
            </th>
            <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Grupa
            </th>
            <th scope="col" class="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.userId" class="hover:bg-gray-50">
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="text-sm text-gray-500 md:hidden">{{ user.email }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
          <span
              :class="getRoleBadgeClass(user.role)"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          >
            {{ user.role }}
          </span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div class="text-sm text-gray-900">{{ user.group || '-' }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                    @click="openUserDetails(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                >
                  <i class="pi pi-eye"></i>
                </button>
                <button
                    @click="openEditModal(user)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                    v-if="user.userId !== authStore.userId"
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <UserModal
        :show="showFormModal"
        :title="isEditMode ? 'Edytuj Użytkownika' : 'Dodaj Użytkownika'"
        @close="closeFormModal"
    >
      <UserForm
          :user="isEditMode ? selectedUser : {}"
          @submit="handleSubmit"
          @cancel="closeFormModal"
      />
    </UserModal>

    <!-- User Details Modal -->
    <UserModal
        :show="showDetailsModal"
        title="Szczegóły Użytkownika"
        @close="closeDetailsModal"
    >
      <UserDetails
          :user="selectedUser"
          @close="closeDetailsModal"
      />
    </UserModal>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
        v-if="showDeleteModal"
        message="Czy na pewno chcesz usunąć tego użytkownika?"
        @cancel="closeDeleteModal"
        @confirm="handleDelete"
        title="Potwierdź usunięcie"
    />
  </div>
</template>