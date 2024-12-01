<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

// Tablica ścieżek do zdjęć
const images = Array.from({ length: 12 }, (_, i) => `@/assets/img/carousel/${i + 1}.jpg`)
</script>

<template>
  <carousel :items-to-show="1" :autoplay="4000" :transition="1000">
    <!-- Generowanie slajdów na podstawie tablicy zdjęć -->
    <slide v-for="(image, index) in images" :key="index">
      <img :src="image" class="block w-full h-auto object-cover" :alt="'Slide ' + (index + 1)" />
    </slide>

    <!-- Nawigacja i paginacja -->
    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>
