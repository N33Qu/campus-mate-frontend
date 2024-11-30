<script setup>
import { RouterLink } from 'vue-router';


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
  <section>
    <div class="container m-auto py-6 px-6">
      <RouterLink
          :to= "$props.to"
          class="text-violet-500 hover:text-violet-600 flex items-center"
      >
        <i class="pi pi-plus-circle text-2xl mr-3"></i> {{text}}
      </RouterLink>
    </div>
  </section>
</template>