<script setup>
import {ref, computed, onMounted} from 'vue';
import { scheduleService } from '@/services/scheduleService';
import { usePermissions } from '@/composables/schedule/usePermission';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal.vue';

const props = defineProps({
  selectedGroup: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['group-selected', 'error', 'group-deleted']);
const { isAdmin } = usePermissions();
const groups = ref([]);
const sortAscending = ref(true);
const searchQuery = ref('');
const showDeleteModal = ref(false);
const groupToDelete = ref(null);

const filteredGroups = computed(() => {
  let filtered = groups.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(group =>
        group.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => {
    const compareResult = a.localeCompare(b, undefined, {
      sensitivity: 'base',
      numeric: true
    });
    return sortAscending.value ? compareResult : -compareResult;
  });
});

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value;
};

const handleGroupSelect = (group) => {
  emit('group-selected', group);
};

const fetchGroups = async () => {
  try {
    groups.value = await scheduleService.fetchGroups();
  } catch (err) {
    emit('error', 'Failed to load groups');
  }
};

const handleDeleteClick = (group, event) => {
  event.stopPropagation();
  groupToDelete.value = group;
  showDeleteModal.value = true;
};

const handleDeleteConfirm = async () => {
  try {
    await scheduleService.deleteSchedule(groupToDelete.value);
    emit('group-deleted', groupToDelete.value);
    await fetchGroups();
  } catch (err) {
    emit('error', 'Nie udało się usunąć planu');
  } finally {
    showDeleteModal.value = false;
    groupToDelete.value = null;
  }
};

const handleDeleteCancel = () => {
  showDeleteModal.value = false;
  groupToDelete.value = null;
};

onMounted(() => {
  fetchGroups();
});

defineExpose({
  refresh: fetchGroups
});

</script>

<template>
  <div class="p-6 bg-elementLight rounded-lg shadow-sm">
    <div class="flex flex-col gap-4">
      <!-- Search -->
      <div class="relative">
        <input
            v-model="searchQuery"
            type="text"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg pl-10 focus:ring-2 focus:ring-appBg focus:border-transparent"
            placeholder="Szukaj grupy..."
        />
        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-800">Grupy</h3>
        <button
            @click="toggleSortOrder"
            class="px-3 py-1 text-sm rounded-md bg-element hover:bg-elementHover transition-colors duration-200"
        >
          Sortuj {{ sortAscending ? '↓' : '↑' }}
        </button>
      </div>

      <!-- Groups List -->
      <div class="space-y-3 max-h-[400px] overflow-y-auto">
        <button
            v-for="group in filteredGroups"
            :key="group"
            @click="handleGroupSelect(group)"
            class="w-full px-5 py-3 text-left rounded-lg transition-colors duration-200 hover:bg-elementHover flex justify-between items-center"
            :class="[selectedGroup === group ? 'bg-element' : 'text-gray-700']"
        >
          <span>{{ group }}</span>
          <button
              v-if="isAdmin"
              @click="handleDeleteClick(group, $event)"
              class="text-red-600 hover:text-red-800 p-1"
          >
           <i class="pi pi-trash"></i>
          </button>
        </button>
      </div>

      <div v-if="filteredGroups.length === 0" class="text-gray-500 text-sm p-4 text-center">
        {{ groups.length === 0 ? 'Brak grup' : 'Nie znaleziono grup' }}
      </div>
    </div>

    <DeleteConfirmationModal
        v-if="showDeleteModal"
        title="Usuń plan"
        :message="`Czy na pewno chcesz usunąć plan dla grupy ${groupToDelete}?`"
        @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel"
    />
  </div>
</template>