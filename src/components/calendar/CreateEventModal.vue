<script setup>
import {eventSchema} from '@/validation/eventSchema'
import {useEventForm} from '@/composables/useEventForm'

const emit = defineEmits(['close', 'save'])

const {
  formData,
  errors,
  isSubmitting,
  isValid,
  validateForm
} = useEventForm(eventSchema)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const validData = await validateForm()
    if (validData) {
      emit('save', {
        eventName: validData.title,
        eventDescription: validData.description,
        startDate: validData.start,
        endDate: validData.end,
        teamId: validData.teamId
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h3 class="text-xl font-bold mb-4">Dodaj nowe wydarzenie</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Tytuł</label>
        <input
            v-model="formData.title"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
        <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
        <span class="text-sm text-gray-500">{{ formData.title.length }}/50</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Opis</label>
        <textarea
            v-model="formData.description"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            rows="3"
        ></textarea>
        <span v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</span>
        <span class="text-sm text-gray-500">{{ formData.description.length }}/200</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Rozpoczęcie</label>
        <input
            v-model="formData.start"
            type="datetime-local"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
        <span v-if="errors.start" class="text-sm text-red-500">{{ errors.start }}</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Zakończenie</label>
        <input
            v-model="formData.end"
            type="datetime-local"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
        <span v-if="errors.end" class="text-sm text-red-500">{{ errors.end }}</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Id zespołu</label>
        <input
            v-model="formData.teamId"
            type="number"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
        />
        <span v-if="errors.teamId" class="text-sm text-red-500">{{ errors.teamId }}</span>
      </div>
      <div class="flex gap-2">
        <button
            type="submit"
            class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="!isValid || isSubmitting"
        >
          Create
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