<script setup>
import { defineProps } from 'vue';
import bg from '../assets/img/hero-bg.png';
import 'primeicons/primeicons.css'
defineProps({
  title: {
    type: String,
    default: 'Witaj na Campusmate',
  },
  subtitle: {
    type: String,
    default: 'Znajdz swoje miejsce na uczelni!',
  },
});
</script>

<template>
  <section class="bg-cover bg-center py-20 mb-4" :style="{ backgroundImage: `url(${bg})` }" id="hero">
    <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
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