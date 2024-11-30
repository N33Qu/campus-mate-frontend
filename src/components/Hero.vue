<script setup>
import { defineProps } from 'vue';
import 'primeicons/primeicons.css';
import Carousel from "@/components/Carousel.vue";

defineProps({
  title: {
    type: String,
    default: 'Witaj na CampusMate',
  },
  subtitle: {
    type: String,
    default: 'Znajdź swoje miejsce na uczelni!',
  },
});
</script>

<template>
  <section class="py-20 mb-4" id="hero">
    <Carousel /> <!-- Karuzela zastępuje tło -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          {{ title }}
        </h1>
        <p class="my-4 text-xl text-white">
          {{ subtitle }}
        </p>
        <RouterLink class="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded" to="/login">
          Zaloguj się
          <i class="pi pi-sign-in ml-2"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Opcjonalne style, aby karuzela lepiej się komponowała */
#hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.carousel img {
  max-height: 500px; /* Ogranicz wysokość obrazów */
  object-fit: cover;
}
</style>
