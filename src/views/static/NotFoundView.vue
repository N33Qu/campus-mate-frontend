<script setup>
import {RouterLink} from 'vue-router';
</script>

<template>
  <div class="text-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-elementLight rounded-lg shadow-lg overflow-hidden">
      <section class=" text-center flex flex-col justify-center items-center h-96">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-7xl mb-5"></i>
        <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
        <p class="text-xl mb-5">Ta strona nie istnieje</p>
        <RouterLink
            to="/"
            class="text-white bg-button hover:bg-buttonHover rounded-md px-3 py-2 mt-4"
        >
          Strona główna
        </RouterLink
        >
      </section>
    </div>
  </div>
</template>