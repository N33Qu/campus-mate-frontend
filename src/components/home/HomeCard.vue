<script setup>

import Card from "@/components/Card.vue";
import {RouterLink} from "vue-router";

defineProps({
  card: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <Card :bg="$props.card.bg">
    <div class="flex items-center">
      <span class="text-xl font-bold">{{ card.title }}</span>
      <i :class="card.icon + ' text-xl ml-4' "></i>
    </div>
    <p class="mt-2 mb-4">
      {{card.description}}
    </p>
    <RouterLink
        :to="$props.card.to"
        class="inline-block bg-stone-950 text-white rounded-lg px-4 py-2 text-xs hover:bg-stone-900"
    >
      {{card.buttonText}}
    </RouterLink>
  </Card>
</template>
