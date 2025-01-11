<script setup>
import {ref, onMounted, computed} from 'vue';
import {useUserProfile} from '@/composables/user/useUserProfile.js';
import EditProfileModal from '@/components/user/EditProfileModal.vue';
import ChangePasswordModal from '@/components/user/ChangePasswordModal.vue';
import {useRoute} from 'vue-router';
import {useAuthStore} from "@/stores/authStore.js";
import {useToastStore} from "@/stores/toastStore.js";
import router from "@/router/router.js";
import {authService} from "@/services/authService.js";

const route = useRoute();
const authStore = useAuthStore();
const toastStore = useToastStore();

const userId = route.params.id;
const showEditModal = ref(false);
const showPasswordModal = ref(false);

const {
  profile,
  isLoading,
  error,
  fetchProfile,
  updateProfile,
  updatePassword
} = useUserProfile(userId);

const handleProfileUpdate = async (values) => {
  const success = await updateProfile(values);
  if (success) {
    showEditModal.value = false;
  }
};

const handlePasswordUpdate = async (values) => {
  try {
    const passwordData = {
      email: profile.email,
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    };
    await updatePassword(passwordData);
    showPasswordModal.value = false;
    toastStore.setToast('Hasło zostało zmienione. Zostałeś wylogowany!', 'success');
    authStore.logout();
    await authService.logout();
    await router.push('/');
  } catch (err) {
    console.error('Failed to update password:', err);
  }
};

const initialValues = computed(() => ({
  firstName: profile.firstName,
  lastName: profile.lastName
}))

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-4">
    <div v-if="isLoading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-element mx-auto"></div>
    </div>

    <div v-else class="bg-elementLight shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6">Mój profil</h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Profile Information -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600">
            {{ profile.email }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Imię</label>
          <div
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600">
            {{ profile.firstName }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nazwisko</label>
          <div
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-600">
            {{ profile.lastName }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button
              @click="showEditModal = true"
              class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-editButton hover:bg-editButtonHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
          <button
              @click="showPasswordModal = true"
              class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-changePasswordButton hover:bg-changePasswordButtonHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditProfileModal
        v-model="showEditModal"
        :initial-values="initialValues"
        :is-loading="isLoading"
        @save="handleProfileUpdate"
    />

    <ChangePasswordModal
        v-model="showPasswordModal"
        :is-loading="isLoading"
        @save="handlePasswordUpdate"
    />
  </div>

</template>

