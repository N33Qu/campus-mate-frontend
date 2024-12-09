<script setup>

import PostListings from "@/components/PostListings.vue";
import {RouterLink} from "vue-router";
import AddButton from "@/components/TextButton.vue";
</script>

<template>
  <AddButton :to="`/posts/add`" :text="`Dodaj Ogłoszenie`"/>
  <PostListings/>
</template>
