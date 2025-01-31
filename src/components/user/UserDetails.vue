<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
defineEmits(['close'])
</script>

<template>
  <div class="space-y-4">
    <div v-if="user" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Imie i nazwisko</h3>
          <p class="mt-1 text-sm text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Email</h3>
          <p class="mt-1 text-sm text-gray-900">{{ user.email }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Rola</h3>
          <p class="mt-1 text-sm text-gray-900">{{ user.role }}</p>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
            @click="$emit('close')"
            class="px-4 py-2 bg-cancelButton text-white rounded-md hover:bg-cancelButtonHover"
        >
          Zamknij
        </button>
      </div>
    </div>
  </div>
</template>