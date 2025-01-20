<script setup>
import Navbar from "@/components/home/Navbar.vue";
import Footer from "@/components/home/Footer.vue";
import { RouterView } from "vue-router";
import { onMounted } from "vue";

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar class="sticky top-0 z-50" />
    <main class="flex-grow bg-appBg">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
