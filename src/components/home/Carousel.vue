<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const images = Array.from({ length: 12 }, (_, i) => `src/assets/img/carousel/${i + 1}.jpg`)
</script>

<template>
  <Carousel class="sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[80vh] m-0 pt-0 " :items-to-scroll="1" :items-to-show="1" :autoplay="4000" :transition="1000" :mouse-drag=false :touch-drag=false :wrap-around="true">
    <!-- Generowanie slajdów na podstawie tablicy zdjęć -->
    <Slide v-for="(image, index) in images" :key="index">
      <img :src="image" class="block w-full sm:h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[80vh] m-0 object-cover" :alt="'Slide ' + (index + 1)" />
    </Slide>

    <template #addons>
      <Navigation/>
      <Pagination />
    </template>
  </Carousel>
</template>
