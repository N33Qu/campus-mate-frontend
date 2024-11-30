<script setup>
import { RouterLink } from 'vue-router';
import Card from '@/components/Card.vue';
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
          <div class="flex items-center">
            <span class="text-2xl font-bold">Twoje Zespoły</span>
            <i class="pi pi-users ml-4 text-2xl"></i>
          </div>
          <p class="mt-2 mb-4">
            Zobacz swoje zespoły i członków.
          </p>
          <RouterLink
              to="/teams"
              class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Przeglądaj Zespoły
          </RouterLink>
        </Card>
        <Card bg="bg-violet-100">
          <h2 class="text-2xl font-bold">Twój Plan</h2>
          <p class="mt-2 mb-4">
            Przeglądaj nadchodzące i przeszłe wydarzenia.
          </p>
          <RouterLink
              to="/schedule"
              class="inline-block bg-violet-600 text-white rounded-lg px-4 py-2 hover:bg-violet-700"
          >
            Przeglądaj Plan
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>
</template>