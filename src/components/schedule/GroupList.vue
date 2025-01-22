<template>
  <div class="p-6 bg-white rounded-lg shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-medium text-gray-800">Grupy</h3>
      <div class="flex gap-2">
        <button
          @click="toggleSortOrder"
          class="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          Sortuj {{ sortAscending ? '↓' : '↑' }}
        </button>
      </div>
    </div>
    <div class="space-y-3">
      <button
        v-for="group in sortedGroups"
        :key="group"
        @click="handleGroupSelect(group)"
        class="w-full px-5 py-3 text-left rounded-lg transition-colors duration-200 hover:bg-gray-100"
        :class="[
          selectedGroup === group 
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
            : 'text-gray-700'
        ]"
      >
        {{ group }}
      </button>
    </div>
    <div v-if="groups.length === 0" class="text-gray-500 text-sm p-4 text-center">
      Brak grup
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  selectedGroup: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['group-selected', 'error']);
const groups = ref([]);
const sortAscending = ref(true);

const sortedGroups = computed(() => {
  return [...groups.value].sort((a, b) => {
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
    const response = await fetch('/api/schedule', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }

    const schedules = await response.json();
    groups.value = [...new Set(schedules.map(schedule => schedule.group))];
  } catch (err) {
    emit('error', 'Failed to load groups');
  }
};

const refresh = () => {
  return fetchGroups();
};

onMounted(() => {
  fetchGroups();
});

defineExpose({
  refresh
});
</script>