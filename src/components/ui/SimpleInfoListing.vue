<script setup>


defineProps({
  listing: {
    title: String,
    description: String
  }

})

</script>

<template>
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">{{listing.title}}</h2>
    <p class="text-lg mb-4">
      {{listing.description}}
    </p>
  </div>
</template>
