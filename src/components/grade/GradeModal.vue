<script setup>
import { gradeSchema } from '@/validation/gradeSchema'
import { useGradeForm } from '@/composables/grade/useGradeForm.js'

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


const {
  subjectName,
  subjectNameProps,
  grade,
  gradeProps,
  comment,
  commentProps,
  userId,
  userIdProps,
  errors,
  isSubmitting,
  onSubmit
} = useGradeForm(gradeSchema, props)


const handleSubmit = async () => {
  try {
    const result = await onSubmit();
    console.log("Result", result)
      emit('save-grade', result);
  } catch (error) {
    console.error('Form submission error:', error);
  }
};
</script>

<template>
  <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-96">
      <h2 class="text-2xl font-bold mb-4">
        {{ mode === 'add' ? 'Dodaj nową ocenę' : 'Edytuj ocenę' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-bold mb-2" for="subjectName">
            Nazwa przedmiotu
          </label>
          <input
              v-model="subjectName"
              v-bind="subjectNameProps"
              id="subjectName"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.subjectName }"
          />
          <span class="text-sm text-gray-500">{{ subjectName?.length || 0 }}/50</span>
          <br><span v-if="errors.subjectName" class="text-sm text-red-500">{{ errors.subjectName }}</span>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2" for="grade">
            Ocena
          </label>
          <input
              v-model="grade"
              v-bind="gradeProps"
              id="grade"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.grade }"
          />
          <span v-if="errors.grade" class="text-sm text-red-500">{{ errors.grade }}</span>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2" for="comment">
            Komentarz (Opcjonalny)
          </label>
          <textarea
              v-model="comment"
              v-bind="commentProps"
              id="comment"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.comment }"
          ></textarea>
          <span class="text-sm text-gray-500">{{ comment?.length || 0 }}/200</span>
          <br><span v-if="errors.comment" class="text-sm text-red-500">{{ errors.comment }}</span>
        </div>

        <div v-if="mode === 'add'">
          <label class="block text-gray-700 font-bold mb-2" for="userId">
            User ID
          </label>
          <input
              v-model="userId"
              v-bind="userIdProps"
              id="userId"
              type="number"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.userId }"
          />
          <span v-if="errors.userId" class="text-sm text-red-500">{{ errors.userId }}</span>
        </div>

        <div class="flex justify-end space-x-4">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-cancelButton hover:bg-cancelButtonHover text-gray-800 font-bold py-2 px-4 rounded"
          >
            Anuluj
          </button>
          <button
              type="submit"
              class="bg-saveButton hover:bg-saveButtonHover text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
          >
            {{ mode === 'add' ? 'Dodaj' : 'Zapisz' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>