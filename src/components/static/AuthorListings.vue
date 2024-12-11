<script setup>
import AuthorListing from "@/components/static/AuthorListing.vue";

defineProps({
  authors: {
    type: []
  }
})
</script>

<template>
  <div class="bg-element p-8">
    <h2 class="text-3xl font-bold mb-8 text-center text-headerText">Nasz Zespół</h2>
    <div class="grid md:grid-cols-2 gap-8">
      <AuthorListing v-for="author in authors" :key="author.name" :author="author" />
    </div>
  </div>
</template>
