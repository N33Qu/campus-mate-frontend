<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { teamService } from '@/services/teamService';
import { userService } from '@/services/userService';

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'users-added']);

const toast = useToast();
const searchQuery = ref('');
const selectedUsers = ref([]);
const availableUsers = ref([]);
const isLoading = ref(false);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return availableUsers.value;
  const query = searchQuery.value.toLowerCase();
  return availableUsers.value.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
  );
});

const fetchAvailableUsers = async () => {
  isLoading.value = true;
  try {
    const response = await userService.getAllUsersByRole('ROLE_STUDENT');
    availableUsers.value = response;
  } catch (error) {
    toast.error('Error fetching available users');
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

const toggleUser = (userId) => {
  const index = selectedUsers.value.indexOf(userId);
  if (index === -1) {
    selectedUsers.value.push(userId);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const addUsers = async () => {
  if (selectedUsers.value.length === 0) {
    toast.warning('Please select at least one user');
    return;
  }
  isLoading.value = true;
  try {
    await teamService.addUsersToTeam(props.teamId, selectedUsers.value);
    toast.success('Users added successfully');
    emit('users-added');
    emit('close');
  } catch (error) {
    toast.error('Error adding users');
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

fetchAvailableUsers();
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl mx-4">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Add Team Members</h2>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="Search users..."
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="max-h-96 overflow-y-auto border rounded-lg">
          <div v-if="isLoading" class="flex justify-center py-8">
            <i class="pi pi-spinner animate-spin text-4xl text-gray-500"></i>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-4 text-center text-gray-500">
            No users found
          </div>

          <div v-else class="divide-y">
            <div
                v-for="user in filteredUsers"
                :key="user.userId"
                class="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                @click="toggleUser(user.userId)"
            >
              <input
                  type="checkbox"
                  :checked="selectedUsers.includes(user.userId)"
                  class="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{{ user.firstName }} {{ user.lastName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex justify-end space-x-4">
        <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            :disabled="isLoading"
        >
          Cancel
        </button>
        <button
            type="button"
            @click="addUsers"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="isLoading || selectedUsers.length === 0"
        >
          {{ isLoading ? 'Adding...' : 'Add Selected' }}
        </button>
      </div>
    </div>
  </div>
</template>