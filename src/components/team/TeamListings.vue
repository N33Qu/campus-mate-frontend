<script setup>
import TeamListing from "@/components/team/TeamListing.vue";
import {reactive, defineProps, onMounted} from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import api from "@/config/axiosConfig.js";
import AddButton from "@/components/ui/TextButton.vue";

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false
  },
});

const state = reactive({
  teams: [],
  isLoading: true
});

onMounted(async () => {
  try {
    const response = await api.get('/team');
    state.teams = response.data;
  } catch (error) {
    console.error('Error fetching teams', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-appBg py-12 h-screen">
    <section class="bg-elementLight px-4 py-10">
      <div class="container-xl lg:container m-auto">
        <h2 class="text-3xl font-bold text-headerText mb-6 text-center">Przeglądaj zespoły</h2>
        <AddButton :to="`/teams/create-team`" text="Stwórz nowy zespół" icon="pi pi-user-plus" />
        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <PulseLoader/>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TeamListing
              v-for="team in state.teams.slice(0, limit || state.teams.length)"
              :key="team.teamId"
              :team="team"
          />
        </div>
      </div>
    </section>
  </section>
</template>