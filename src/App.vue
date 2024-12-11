<script setup>
import Navbar from "@/components/home/Navbar.vue";
import Footer from "@/components/home/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar class="sticky top-0 z-50" />
    <main class="flex-grow">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
