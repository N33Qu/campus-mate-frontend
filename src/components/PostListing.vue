<script setup>
import { RouterLink } from 'vue-router';
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  post: {
    type: {
      Object,
    },
    required: true,
  },
});

const showFullDescription = ref(false);

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

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
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ post.author }}</div>
        <h3 class="text-xl font-bold">{{ post.postTitle }}</h3>
      </div>

      <div class="mb-5">
        <div>
          {{ truncatedContent }}
        </div>
        <button
            @click="toggleFullDescription"
            class="text-violet-500-500 hover:text-textLink mb-5"
        >
          {{ showFullDescription ? 'Mniej' : 'Więcej' }}
        </button>
      </div>
      <!--Post info-->
      <h3 class="text-textLink mb-2">Stworzony: {{ post.createdAt }}</h3>

      <div class="border border-gray-100 mb-5"></div>

      <RouterLink
          :to="'/posts/' + post.postId"
          class="h-[36px] bg-button hover:bg-buttonHover text-white px-4 py-2 rounded-lg text-center text-sm"
      >
        Czytaj Więcej
      </RouterLink>
    </div>
  </div>
</template>