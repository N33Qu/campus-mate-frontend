<script setup>
import {computed, defineProps} from "vue";

const props = defineProps({
  author: {
    type: Object,
    default: () => ({
      name: 'John Doe',
      role: 'Developer',
      linkedin: '#',
      github: '#',
      image: 'defaultAuthor.png',
    })
  }
});
const authorImage = computed(() => {
  try {

    return new URL(`/src/assets/img/authors/${props.author.image}`, import.meta.url).href;
  } catch (error) {
    console.error('Image loading error:', error);
    return new URL(`/src/assets/img/authors/defaultAuthor.png`, import.meta.url).href;
  }
});
</script>

<template>
  <div class="bg-elementLight rounded-lg shadow-md p-6 text-center">
    <img
        :src="authorImage"
        :alt="author.name"
        class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />
    <h3 class="text-xl font-semibold mb-2 text-headerText">{{ author.name }}</h3>
    <p class="mb-4">{{ author.role }}</p>
    <div class="flex justify-center space-x-4">
      <a
          :href="author.linkedin"
          class="text-textLink hover:text-textLinkHover transition-colors"
      >
        LinkedIn
      </a>
      <a
          :href="author.github"
          class="text-textLink hover:text-textLinkHover transition-colors"
      >
        GitHub
      </a>
    </div>
  </div>
</template>