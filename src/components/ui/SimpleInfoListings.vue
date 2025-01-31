<script setup>
  import SimpleInfoListing from "@/components/ui/SimpleInfoListing.vue";

  defineProps({
    listingsTitle: {
      type: String,
      default: 'O Naszej Stronie'
    },
    listings: [Object],
  })
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-headerText">{{listingsTitle}}</h1>
    <SimpleInfoListing v-for="listing in listings" :key="listing.title" :listing="listing" />
  </div>
</template>

