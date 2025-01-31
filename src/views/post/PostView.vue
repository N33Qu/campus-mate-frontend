<script setup>
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { usePost } from '@/composables/post/usePost';
import PostModal from "@/components/post/PostModal.vue";
import {usePermissions} from "@/composables/usePermissions.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const showConfirmDelete = ref(false);
const showEditModal = ref(false);

const postId = route.params.id;

const state = ref({
  post: {},
  isLoading: true,
});

const { deletePost, fetchPost } = usePost();
const { canEdit, canDelete } = usePermissions();
const handleDelete = async () => {
  try {
    if (await deletePost(postId)) {
      await router.push('/posts');
    }
    showConfirmDelete.value = false;
  } catch (error) {
    console.error('Error deleting post', error);
    toast.error('Wystąpił błąd podczas usuwania ogłoszenia');
  }
};

const fetchPostData = async () => {
  try {
    state.value.post = await fetchPost(postId);
  } catch (error) {
    console.error('Error fetching post', error);
  } finally {
    state.value.isLoading = false;
  }
};

onMounted(() => {
  fetchPostData();
});

const handlePostSaved = async () => {
  showEditModal.value = false;
  await fetchPostData();
};
</script>

<template>
  <div class="container mx-auto">
    <section v-if="!state.isLoading" class="bg-elementLight rounded-lg m-6">
      <button
      @click="$router.back()"
      >
        <i class="pi pi-arrow-left text-xl text-gray-600 pt-6 pl-6"></i>
      </button>
      <div class="container m-auto py-6 px-6">
        <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
          <main>
            <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
              <div class="text-gray-500 mb-4">{{ state.post.author }}</div>
              <h1 class="text-3xl font-bold mb-4">{{ state.post.postTitle }}</h1>
              <div class="text-gray-400 text-sm">
                Stworzony: {{ new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(state.post.createdAt)) }}
              </div>
              <div class="text-gray-400 text-sm">
                Edytowany: {{ new Intl.DateTimeFormat('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(state.post.updatedAt)) }}
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-headerText text-lg font-bold mb-6">Treść ogłoszenia</h3>
              <p class="mb-4">{{ state.post.postContent }}</p>
            </div>
          </main>

          <!-- Sidebar -->
          <aside>
            <!-- Manage -->
            <div v-show="canDelete() || canEdit()" class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-xl font-bold mb-6">Zarządzaj</h3>
              <div class="flex flex-col gap-4">
                <button
                    v-if="canEdit()"
                    @click="showEditModal = true"
                    class="flex items-center justify-center gap-2 bg-editButton hover:bg-editButtonHover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                >
                  <i class="pi pi-pencil"></i>
                  Edytuj
                </button>
                <button
                    v-if="canDelete()"
                    @click="showConfirmDelete = true"
                    class="flex items-center justify-center gap-2 bg-deleteButton hover:bg-deleteButtonHover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                >
                  <i class="pi pi-trash"></i>
                  Usuń
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
    <div v-else class="text-center text-gray-500 py-6">
      <RiseLoader color="#8b5cf6" />
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
            class="px-4 py-2 text-sm text-gray-700 bg-cancelButton border border-gray-300 rounded-md hover:bg-cancelButtonHover"
        >
          Anuluj
        </button>
        <button
            @click="handleDelete"
            class="px-4 py-2 text-sm text-white bg-deleteButton rounded-md hover:bg-deleteButtonHover"
        >
          Usuń
        </button>
      </div>
    </div>
  </div>

  <!-- Post Modal -->
  <PostModal
      :is-open="showEditModal"
      :post-id="postId"
      @close="showEditModal = false"
      @saved="handlePostSaved"
  />
</template>