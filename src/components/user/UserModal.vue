<script setup>
defineProps({
  show: Boolean,
  title: String,
})
const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-elementLight rounded-lg p-6 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div class="space-y-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>