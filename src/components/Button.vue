<script setup>

import {RouterLink} from "vue-router";

defineProps({
  to: {
    type: String,
    default: "/",
  },
  text: {
    type: String,
    default: "Add",
  },
});
</script>

<template>
    <div class="container m-auto py-6 px-6">
      <RouterLink
          :to= "$props.to"
      >
        <button
            class="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block">
          {{text}}
        </button>
      </RouterLink>
    </div>
</template>
