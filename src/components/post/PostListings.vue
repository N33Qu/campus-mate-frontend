<script setup>
import {RouterLink} from 'vue-router';
import PostListing from './PostListing.vue';
import {ref, defineProps, onMounted} from 'vue';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';
import api from '@/axios.js';

defineProps({
  limit: {
    type: Number,
    default: 12,
  },
  showButton: {
    type: Boolean,
    default: false,
  },
});

const state = ref({
  posts: [],
  isLoading: true,
  isAuthorized: false,
  isEmpty: false
});

onMounted(async () => {
  try {
    const response = await api.get('/post');

      state.value.posts = response.data;
      state.value.isAuthorized = true


  } catch (error) {
    if( error.status === 401) {
      state.value.isAuthorized = false
    }
    else if (error.status === 404) {
      state.value.isEmpty = true
      state.value.isAuthorized = true
    }
    else{
      console.error('Error fetching posts', error);
    }
  } finally {
    state.value.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-appBg py-12 h-screen">
    <section class="bg-elementLight px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-headerText mb-6 text-center">
          Przeglądaj Ogłoszenia
        </h2>
        <!-- Show loading spinner while loading is true -->
        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <RiseLoader color='element'/>
        </div>
        <div v-else-if="state.isEmpty === true" class="text-center text-gray-500 py-6">
          <i class="pi pi-info-circle text-xl"></i>
          <h4>Nie znaleziono postów</h4>
        </div>
        <div v-else-if="state.isAuthorized === false" class="text-center py-6">
          <a class="text-gray-500 text-sm " href="/login">Zaloguj się zby zobaczyć ogłoszenia</a>
        </div>
        <!--Post listing-->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PostListing
              v-for="post in state.posts.slice(0, limit || state.posts.length)"
              :key="post.id"
              :post="post"
          />
        </div>
      </div>
    </section>

    <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
      <RouterLink
          to="/posts"
          class="block bg-stone-950 text-white text-center py-4 px-6 rounded-lg hover:bg-stone-900"
      >Zobacz Wszystkie Ogłoszenia
      </RouterLink>
    </section>
  </section>
</template>