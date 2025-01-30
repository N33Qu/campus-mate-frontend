<script setup>
import { usePermissions} from "@/composables/usePermissions.js";

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  },
  creatorId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['remove-user', 'search', 'add-users']);
const { canEdit } = usePermissions();
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-4 border-b">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Członkowie</h2>
        <button
            v-show="canEdit()"
            @click="emit('add-users')"
            class=" p-1"
        >
          <i class="pi pi-user-plus text-addButton hover:text-addButtonHover"></i>
        </button>
      </div>

      <input
          type="text"
          :value="searchQuery"
          @input="e => emit('search', e.target.value)"
          placeholder="Wyszukaj..."
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-appBg focus:border-transparent"
      />
    </div>

    <div class="divide-y max-h-96 overflow-y-auto">
      <div v-if="users.length === 0" class="p-4 text-center text-gray-500">
        Nie znaleziono członków
      </div>

      <div
          v-for="user in users"
          :key="user.userId"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div>
          <span class="font-medium">{{ user.firstName }} {{ user.lastName }}</span>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>

        <button
            v-show="canEdit()"
            v-if="user.userId !== creatorId && canEdit()"
            @click="emit('remove-user', user.userId)"
            class="p-2"
        >
          <i class="pi pi-trash text-deleteButton hover:text-deleteButtonHover"></i>
        </button>
      </div>
    </div>
  </div>
</template>