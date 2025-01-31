<script setup>
import { ref } from 'vue';
import { usePost } from '@/composables/post/usePost';
import { usePermissions } from '@/composables/usePermissions.js';
import PostModal from '@/components/post/PostModal.vue';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  teamId: {
    type: String,
    required: true
  },
});

const showPostModal = ref(false);
const showDeleteModal = ref(false);
const selectedPostId = ref(null);
const { deletePost } = usePost();
const { canCreate, canEdit, canDelete } = usePermissions();

const handleAddPost = () => {
  selectedPostId.value = null;
  showPostModal.value = true;
};

const handleEditPost = (postId) => {
  selectedPostId.value = postId;
  showPostModal.value = true;
};

const handleDeleteClick = (postId) => {
  selectedPostId.value = postId;
  showDeleteModal.value = true;
};

const handlePostSaved = async () => {
  showPostModal.value = false;
  emit('refresh');
};

const handleDeleteConfirm = async () => {
  if (selectedPostId.value) {
    await deletePost(selectedPostId.value);
    showDeleteModal.value = false;
    emit('refresh');
  }
};

const emit = defineEmits(['refresh']);
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b flex justify-between items-center">
      <h2 class="text-2xl font-bold">Ogłoszenia</h2>
      <button
          v-if="canCreate()"
          @click="handleAddPost"
          class="p-2 text-primary hover:text-primary-dark transition-colors"
      >
        <i class="pi pi-plus text-xl"></i>
      </button>
    </div>

    <div class="divide-y max-h-[600px] overflow-y-auto">
      <div v-if="posts.length === 0" class="p-6 text-center text-gray-500">
        <div>
          <i class="pi pi-info-circle mr-2"></i>
          <div>Brak ogłoszeń</div>
        </div>
      </div>

      <div
          v-for="post in posts"
          :key="post.postId"
          class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="text-sm text-gray-500 mb-4">
              <div>Stworzony: {{ new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.createdAt)) }}</div>
              <div v-if="post.updatedAt !== post.createdAt">
                Edytowany: {{ new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.updatedAt)) }}
              </div>
            </div>
            <h1 class="text-xl font-bold mb-2">{{ post.postTitle }}</h1>
            <p class="text-gray-800">{{ post.postContent }}</p>
          </div>
          <div v-if="canEdit(post.authorId)" class="flex gap-2">
            <button
                @click="handleEditPost(post.postId)"
                class="p-2 text-editButton hover:text-editButtonHover"
            >
              <i class="pi pi-pencil"></i>
            </button>
            <button
                v-if="canDelete(post.authorId)"
                @click="handleDeleteClick(post.postId)"
                class="p-2 text-deleteButton hover:text-deleteButtonHover"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Modal -->
    <PostModal
        :is-open="showPostModal"
        :post-id="selectedPostId"
        :team-id="teamId"
        @close="showPostModal = false"
        @saved="handlePostSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
        v-if="showDeleteModal"
        title="Usuń ogłoszenie"
        message="Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć."
        @confirm="handleDeleteConfirm"
        @cancel="showDeleteModal = false"
    />
  </div>
</template>