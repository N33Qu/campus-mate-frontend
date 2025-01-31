<script setup>
import { RouterLink } from 'vue-router';
import { defineProps, ref, computed } from 'vue';
import { usePost } from '@/composables/post/usePost';
import {usePermissions} from "@/composables/usePermissions.js";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  showManageButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit']);

const { canEdit, canDelete} = usePermissions();
const { deletePost } = usePost();
const showFullDescription = ref(false);
const showConfirmDelete = ref(false);

const truncatedContent = computed(() => {
  if (!props.post.postContent) {
    return '';
  }

  let content = props.post.postContent;
  if (!showFullDescription.value) {
    content = content.substring(0, 90) + '...';
  }
  return content;
});

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const handleEdit = () => {
  emit('edit', props.post.postId);
};

const handleDelete = async () => {
  if (await deletePost(props.post.postId)) {
    showConfirmDelete.value = false;
    emit('deleted');
  }
};
</script>

<template>
  <div class="bg-elementLight rounded-xl shadow-md relative">
    <div class="p-4">
      <!-- Author and Title -->
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ post.author }}</div>
        <h3 class="text-xl font-bold">{{ post.postTitle }}</h3>
      </div>

      <!-- Content -->
      <div class="mb-5">
        <div>{{ truncatedContent }}</div>
        <button
            @click="toggleFullDescription"
            class="text-textLink hover:text-textLinkHover mb-5 text-sm"
        >
          {{ showFullDescription ? 'Mniej' : 'Więcej' }}
        </button>
      </div>

      <!-- Post Info -->
      <div class="text-sm text-gray-500 mb-4">
        <div>Stworzony: {{ post.createdAt }}</div>
        <div v-if="post.updatedAt !== post.createdAt">
          Edytowany: {{ post.updatedAt }}
        </div>
      </div>

      <div class="border border-gray-100 mb-5"></div>

      <!-- Actions -->
      <div class="flex justify-between items-center">
        <RouterLink
            :to="`/posts/${post.postId}`"
            class="text-textLink hover:text-textLinkHover text-sm font-medium"
        >
          Czytaj Więcej
        </RouterLink>

        <div v-if="props.showManageButton && (canEdit() || canDelete())" class="flex gap-2">
          <button
              v-if="canEdit()"
              @click="handleEdit"
              class="text-green-600 hover:text-green-700 p-2"
              title="Edytuj"
          >
            <i class="pi pi-pencil"></i>
          </button>

          <button
              v-if="canDelete()"
              @click="showConfirmDelete = true"
              class="text-red-600 hover:text-red-700 p-2"
              title="Usuń"
          >
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full m-4">
        <h3 class="text-lg font-medium mb-4">Potwierdź usunięcie</h3>
        <p class="mb-6">Czy na pewno chcesz usunąć to ogłoszenie?</p>
        <div class="flex justify-end gap-4">
          <button
              @click="showConfirmDelete = false"
              class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
              @click="handleDelete"
              class="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  </div>
</template>