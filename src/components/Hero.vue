<script setup>
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
  <section class="py-20 bg-gray-900 flex flex-col items-center justify-center" id="hero">
    <Carousel />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
          {{ title }}
        </h1>
        <p class="my-4 text-xl text-white">
          {{ subtitle }}
        </p>
        <RouterLink class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300" to="/login">
          Zaloguj się
          <i class="pi pi-sign-in ml-2"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

