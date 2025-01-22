<template>
  <div class="group-list">
    <h3 class="text-lg font-medium mb-4">Grupy</h3>
    <div class="space-y-2">
      <button
        v-for="group in groups"
        :key="group"
        @click="handleGroupSelect(group)"
        class="w-full px-4 py-2 text-left rounded transition-colors duration-200"
        :class="[
          selectedGroup === group 
            ? 'bg-blue-100 text-blue-800' 
            : 'hover:bg-gray-100'
        ]"
      >
        {{ group }}
      </button>
    </div>
    <div v-if="groups.length === 0" class="text-gray-500 text-sm">
      Brak grup
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'GroupList',
  
  props: {
    selectedGroup: {
      type: String,
      default: null
    }
  },

  emits: ['group-selected', 'error'],

  setup(props, { emit }) {
    const groups = ref([])

    const handleGroupSelect = (group) => {
      emit('group-selected', group)
    }

    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/schedule', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch groups')
        }

        const schedules = await response.json()
        // Extract unique group names from schedules
        groups.value = [...new Set(schedules.map(schedule => schedule.group))]
      } catch (err) {
        emit('error', 'Failed to load groups')
      }
    }

    // Expose fetchGroups method to parent component
    const refresh = () => {
      return fetchGroups()
    }

    onMounted(() => {
      fetchGroups()
    })

    return {
      groups,
      handleGroupSelect,
      refresh
    }
  }
}
</script>