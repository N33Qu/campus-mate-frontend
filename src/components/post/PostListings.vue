<script setup>
import {onMounted, ref} from 'vue';
import PostListing from './PostListing.vue';
import PostModal from './PostModal.vue';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';
import {usePost} from '@/composables/post/usePost';
import {usePermissions} from "@/composables/usePermissions.js";

const props = defineProps({
  limit: {
    type: Number,
    default: 12,
  },
  showButton: {
    type: Boolean,
    default: false,
  },
  showManageButton: {
    type: Boolean,
    default: false,
  },
});

const {posts, isLoading, isAuthorized, isEmpty, fetchPosts} = usePost();
const { canCreate } = usePermissions();
const showPostModal = ref(false);
const selectedPostId = ref(null);

const openEditModal = (postId) => {
  selectedPostId.value = postId;
  showPostModal.value = true;
};

const handlePostSaved = async () => {
  await fetchPosts();
};

const handleAddPost = () => {
  selectedPostId.value = null;
  showPostModal.value = true;
};

const handlePostDeleted = async () => {
  await fetchPosts();
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <section class="py-12">
    <section class="bg-elementLight px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <div class="flex flex-row items-center justify-center md:justify-between">
          <h2 class="text-3xl font-bold text-headerText mb-6 flex-1 text-center">
            Przeglądaj Ogłoszenia
          </h2>
          <button
              v-if="showManageButton && canCreate()"
              @click="handleAddPost"
              class="ml-auto"
          >
            <i class="pi pi-plus text-xl mb-6 text-left"></i>
          </button>
        </div>
      </div>
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-gray-500 py-6">
          <RiseLoader color="element"/>
        </div>

        <!-- Empty State -->
        <div v-else-if="isEmpty" class="text-center text-gray-500 py-6">
          <i class="pi pi-info-circle text-xl"></i>
          <h4>Nie znaleziono ogłoszeń</h4>
        </div>

        <!-- Unauthorized State -->
        <div v-else-if="!isAuthorized" class="text-center py-6">
          <a class="text-gray-500 text-sm" href="/login">
            Zaloguj się aby zobaczyć ogłoszenia
          </a>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PostListing
              v-for="post in posts.slice(0, limit || posts.length)"
              :key="post.postId"
              :post="post"
              :show-manage-button="showManageButton"
              @edit="openEditModal"
              @deleted="handlePostDeleted"
          />
        </div>
    </section>

    <!-- "See All" button -->
    <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
      <RouterLink
          to="/posts"
          class="block bg-stone-950 text-white text-center py-4 px-6 rounded-lg hover:bg-stone-900"
      >
        Zobacz Wszystkie Ogłoszenia
      </RouterLink>
    </section>

    <!-- Post Modal -->
    <PostModal
        :is-open="showPostModal"
        :post-id="selectedPostId"
        @close="showPostModal = false"
        @saved="handlePostSaved"
    />
  </section>
</template>