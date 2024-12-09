<script setup>
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';
import BackButton from '@/components/TextButton.vue';
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/axios.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const postId = route.params.id;

const state = ref({
  post: {},
  isLoading: true,
});

const deletePost = async () => {
  try {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (confirm) {
      await api.delete(`/post/${postId}`);
      toast.success('Post Deleted Successfully');
      await router.push('/posts');
    }
  } catch (error) {
    console.error('Error deleting post', error);
    toast.error('Failed to delete the post');
  }
};

onMounted(async () => {
  try {
    const response = await api.get(`/post/${postId}`);
    state.value.post = response.data;
  } catch (error) {
    console.error('Error fetching post', error);
  } finally {
    state.value.isLoading = false;
  }
});
</script>


<template>
  <BackButton :to="`/posts`" text="Back to all posts" />
  <section v-if="!state.isLoading" class="bg-violet-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <div class="text-gray-500 mb-4">{{ state.post.author }}</div>
            <h1 class="text-3xl font-bold mb-4">{{ state.post.postTitle }}</h1>
            <div class="text-gray-400 text-sm">
              Created At: {{ state.post.createdAt }}
            </div>
            <div class="text-gray-400 text-sm">
              Updated At: {{ state.post.updatedAt }}
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-green-800 text-lg font-bold mb-6">Post Content</h3>
            <p class="mb-4">{{ state.post.postContent }}</p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Manage -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Zarządzaj</h3>
            <RouterLink
                :to="`/posts/edit/${state.post.postId}`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Edit Post
            </RouterLink>
            <button
                @click="deletePost"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete Post
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div v-else class="text-center text-gray-500 py-6">
    <RiseLoader color="#8b5cf6" />
  </div>
</template>
