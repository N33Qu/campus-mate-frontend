<script setup>
import { RouterLink } from 'vue-router'
import Hero from "@/components/Hero.vue";
import HomeCards from "@/components/HomeCards.vue";
import PostListings from "@/components/PostListings.vue";
import Carousel from "@/components/Carousel.vue";
</script>

<template>
  <Carousel/>
  <Hero/>
  <HomeCards/>
  <PostListings :limit="3" :showButton="true"/>
</template>