<script setup>
import { ref } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  title: props.event.title,
  description: props.event.description,
  start: new Date(props.event.start).toISOString().slice(0, 16),
  end: new Date(props.event.end).toISOString().slice(0, 16)
})

const handleSubmit = () => {
  emit('save', {
    ...props.event,
    ...formData.value,
    eventId: props.event.eventId
  })
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h3 class="text-xl font-bold mb-4">Edit Event</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input
            v-model="formData.title"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
            v-model="formData.description"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            rows="3"
        ></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
            v-model="formData.start"
            type="datetime-local"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">End Date</label>
        <input
            v-model="formData.end"
            type="datetime-local"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
      </div>
      <div class="flex gap-2">
        <button
            type="submit"
            class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Save
        </button>
        <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>