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
  icon: {
    type: String,
    default: "pi pi-plus-circle",
  },
});
</script>

<template>
  <section>
    <div class="container m-auto py-6 px-6">
      <RouterLink
          :to= "$props.to"
          class="text-textLink hover:text-textLinkHover flex items-center"
      >
        <i :class="icon + ' text-2xl mr-2' "></i> {{text}}
      </RouterLink>
    </div>
  </section>
</template>