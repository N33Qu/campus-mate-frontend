<template>
  <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-96">
      <h2 class="text-2xl font-bold mb-4">
        {{ mode === 'add' ? 'Add New Grade' : 'Edit Grade' }}
      </h2>

      <form @submit.prevent="saveGrade" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-bold mb-2" for="subjectName">
            Subject Name
          </label>
          <input
              v-model="formData.subjectName"
              id="subjectName"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2" for="grade">
            Grade
          </label>
          <input
              v-model.number="formData.grade"
              id="grade"
              type="number"
              min="1"
              max="10"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2" for="comment">
            Comment (Optional)
          </label>
          <textarea
              v-model="formData.comment"
              id="comment"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label class="block text-gray-700 font-bold mb-2" for="comment">
            User ID
          </label>
          <textarea
              v-model="formData.userId"
              id="id"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentGrade: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value)
  }
})

const emit = defineEmits(['close', 'save-grade'])

const formData = ref({
  id: null,
  subjectName: '',
  grade: '',
  comment: ''
})

// Watch for changes in currentGrade prop
watch(() => props.currentGrade, (newGrade) => {
  if (newGrade) {
    formData.value = { ...newGrade }
  }
}, { immediate: true })

const saveGrade = () => {
  // Basic validation
  if (!formData.value.subjectName || !formData.value.grade) return

  emit('save-grade', {
    ...formData.value,
    grade: Number(formData.value.grade)
  })
}
</script>