<script setup>
import {computed, ref} from "vue";
import {RouterLink} from "vue-router";

const props = defineProps({
  team: {
    type: Object,
  },
  required: true,
});

const showFullDescription = ref(false);

const truncatedDescription = computed(() => {
  if(!props.team.description) return '';

  let description = props.team.description;

  if(!showFullDescription.value) {
    description = description.substring(0,90);
  }

  return description;
})
</script>

<template>
  <div class="bg-white my-4 p-4 rounded shadow-sm">
    <!-- Wyświetlanie nazwy zespołu -->
    <h2 class="text-lg font-bold">{{ team.teamName }}</h2>
    <!-- Wyświetlanie opisu zespołu -->
    <p class="text-gray-600 text-sm mt-1">{{ truncatedDescription }}</p>
    <!-- Link do szczegółów zespołu -->

    <RouterLink
        :to="`/teams/${team.teamId}`"
    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2 inline-block"
    >
    Wejdź do zespołu
    </RouterLink>
  </div>
</template>
