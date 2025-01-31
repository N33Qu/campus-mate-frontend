<script setup>
import 'primeicons/primeicons.css';
import { useAuthStore } from '@/stores/authStore.js';
import {computed, watch} from "vue";

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isTokenValid);


watch(() => authStore.isLoggedIn, (newValue) => {
  isLoggedIn.value = newValue;
});

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
  <section class="top-0 z-0 p-12" id="hero">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          {{ title }}
        </h1>
        <p class="my-4 text-xl text-white">
          {{ subtitle }}
        </p>
        <div  v-if="isLoggedIn === false">
          <RouterLink class=" bg-button hover:bg-buttonHover text-white text-md font-bold py-2 px-4 rounded transition-colors duration-300" to="/login">
            Zaloguj się
            <i class="pi pi-sign-in ml-2"></i>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink class=" bg-button hover:bg-buttonHover text-white text-md font-bold py-2 px-4 rounded transition-colors duration-300" to="/logout">
            Wyloguj się
            <i class="pi pi-sign-out ml-2"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

