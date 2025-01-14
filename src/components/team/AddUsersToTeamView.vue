<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from "vue-toastification";
import api from '@/config/axiosConfig.js';
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const props = defineProps({
  teamId: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'usersAdded']);

const toast = useToast();

const state = ref({
  availableUsers: [],
  selectedUsers: [],
  isLoading: false,
  searchQuery: ''
});

const fetchAvailableUsers = async () => {
  try {
    state.value.isLoading = true;
    const response = await api.get(`/team/${props.teamId}/available-users`);
    state.value.availableUsers = response.data;
  } catch (error) {
    console.error('Error fetching available users:', error);
    toast.error('Błąd podczas pobierania listy użytkowników');
  } finally {
    state.value.isLoading = false;
  }
};

const toggleUserSelection = (userId) => {
  const index = state.value.selectedUsers.indexOf(userId);
  if (index === -1) {
    state.value.selectedUsers.push(userId);
  } else {
    state.value.selectedUsers.splice(index, 1);
  }
};

const addUsers = async () => {
  if (state.value.selectedUsers.length === 0) {
    toast.warning('Wybierz przynajmniej jednego użytkownika');
    return;
  }

  try {
    state.value.isLoading = true;
    await api.post(`/team/${props.teamId}/add-users`, {
      userIds: state.value.selectedUsers
    });
    
    toast.success('Użytkownicy zostali dodani do zespołu');
    emit('usersAdded');
    closeModal();
  } catch (error) {
    console.error('Error adding users:', error);
    toast.error('Błąd podczas dodawania użytkowników');
  } finally {
    state.value.isLoading = false;
  }
};

const closeModal = () => {
  state.value.selectedUsers = [];
  state.value.searchQuery = '';
  emit('close');
};

const filteredUsers = computed(() => {
  const query = state.value.searchQuery.toLowerCase();
  return state.value.availableUsers.filter(user => 
    user.firstName.toLowerCase().includes(query) ||
    user.lastName.toLowerCase().includes(query)
  );
});

onMounted(() => {
  if (props.isOpen) {
    fetchAvailableUsers();
  }
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    fetchAvailableUsers();
  }
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-2xl mx-4">
      <!-- Modal Header -->
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Dodaj użytkowników do zespołu</h2>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <!-- Search Input -->
        <div class="mb-4">
          <input
            type="text"
            v-model="state.searchQuery"
            placeholder="Szukaj użytkowników..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <!-- Users List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="state.isLoading" class="flex justify-center py-4">
            <PulseLoader />
          </div>
          
          <div v-else-if="filteredUsers.length === 0" class="text-center py-4 text-gray-500">
            Brak dostępnych użytkowników
          </div>
          
          <div v-else class="space-y-2">
            <div
              v-for="user in filteredUsers"
              :key="user.userId"
              class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="toggleUserSelection(user.userId)"
            >
              <input
                type="checkbox"
                :checked="state.selectedUsers.includes(user.userId)"
                class="mr-3 h-5 w-5 text-green-500"
              />
              <span>{{ user.firstName }} {{ user.lastName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t flex justify-end space-x-4">
        <button
          @click="closeModal"
          class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          :disabled="state.isLoading"
        >
          Anuluj
        </button>
        <button
          @click="addUsers"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          :disabled="state.isLoading || state.selectedUsers.length === 0"
        >
          {{ state.isLoading ? 'Dodawanie...' : 'Dodaj wybranych' }}
        </button>
      </div>
    </div>
  </div>
</template>