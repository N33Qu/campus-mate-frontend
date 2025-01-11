<script setup>
import { ref, watch, onMounted } from 'vue';
import { usePostForm } from '@/composables/post/usePostForm';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  postId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);
const isVisible = ref(false);

const {
  teams,
  isEditing,
  modalTitle,
  isSaving,
  errors,
  postTitle,
  postTitleProps,
  postContent,
  postContentProps,
  selectedTeams,
  selectedTeamsProps,
  loadData,
  onSubmit,
  closeModal
} = usePostForm(props, emit);


watch(() => isEditing.value, async () => {
   if (isEditing.value) {
     console.log(isEditing.value);
    await loadData();
  }
})

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    isVisible.value = true;
    await loadData();
  } else {
    isVisible.value = false;
  }
});
</script>

<template>
  <div v-if="props.isOpen"
       class="fixed inset-0 z-50 transition-opacity duration-300 ease-in-out"
       :class="isVisible ? 'opacity-100' : 'opacity-0'">
    <!-- Backdrop -->
    <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300"
          :class="isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ modalTitle }}
            </h2>
            <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <span class="sr-only">Zamknij</span>
              <i class="pi pi-times"></i>
            </button>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Teams Selection - Only show when creating new post -->
            <div v-if="!isEditing">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Wybierz zespoły
              </label>
              <div class="relative">
                <select
                    v-model="selectedTeams"
                    v-bind="selectedTeamsProps"
                    multiple
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-formFocus min-h-[100px]"
                >
                  <option
                      v-for="team in teams"
                      :key="team.teamId"
                      :value="team.teamId"
                  >
                    {{ team.teamName }}
                  </option>
                </select>
              </div>
              <p v-if="errors.teams" class="mt-1 text-sm text-red-600">
                {{ errors.teams }}
              </p>
            </div>

            <!-- Title Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tytuł
              </label>
              <input
                  v-model="postTitle"
                  v-bind="postTitleProps"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-formFocus"
              />
              <p v-if="errors.postTitle" class="mt-1 text-sm text-red-600">
                {{ errors.postTitle }}
              </p>
            </div>

            <!-- Content Textarea -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Treść
              </label>
              <textarea
                  v-model="postContent"
                  v-bind="postContentProps"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-formFocus"
              ></textarea>
              <p v-if="errors.postContent" class="mt-1 text-sm text-red-600">
                {{ errors.postContent }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4">
              <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-cancelButton border border-gray-300 rounded-md hover:bg-cancelButtonHover transition-colors duration-200"
              >
                Anuluj
              </button>
              <button
                  type="submit"
                  :disabled="isSaving"
                  class="px-4 py-2 text-sm font-medium text-white bg-saveButton rounded-md hover:bg-saveButtonHover disabled:opacity-50 transition-colors duration-200"
              >
                {{ isSaving ? 'Zapisywanie...' : (isEditing ? 'Zaktualizuj' : 'Utwórz') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>