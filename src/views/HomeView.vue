<script setup>
import Hero from "@/components/Hero.vue";
import HomeCards from "@/components/HomeCards.vue";
import PostListings from "@/components/PostListings.vue";
import Carousel from "@/components/Carousel.vue";
import { useToastStore } from '@/stores/toastStore';
import {onMounted} from "vue";
import {useToast} from "vue-toastification";

const toast = useToast();

onMounted(() => {
  const toastStore = useToastStore();
  if (toastStore.toast) {
    const { message, type } = toastStore.toast;
    toast(message, {type});
    toastStore.clearToast();
  }
});
</script>

<template>
  <Carousel/>
  <Hero/>
  <HomeCards/>
  <PostListings :limit="3" :showButton="true"/>
</template>