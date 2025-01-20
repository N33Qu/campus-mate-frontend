<script setup>
import TeamListing from "@/components/team/TeamListing.vue";
import { reactive, ref, defineProps, onMounted } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import CreateTeamModal from "@/components/team/CreateTeamModal.vue";
import { teamService } from '@/services/teamService';
import {useAuthStore} from "@/stores/authStore.js";
import {userService} from "@/services/userService.js";
import {usePermissions} from "@/composables/usePermissions.js";
import {useToast} from "vue-toastification";

const toast = useToast();

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

const showCreateModal = ref(false);
const authStore = useAuthStore();
const userId = authStore.userId;
const role = authStore.userRole;
const {canManage} = usePermissions();

const fetchTeams = async () => {
  try {
    const response = await userService.getUserTeams(userId);
    if (!response) state.teams = [];
    else state.teams = response.data;
  } catch (error) {
    console.error('Error fetching teams', error);
    state.teams = [];
  } finally {
    state.isLoading = false;
  }
};

onMounted(fetchTeams);
</script>

<template>
  <section class="py-12">
    <section class="bg-elementLight px-4 py-10 rounded-lg">
      <div class="container-xl lg:container m-auto">
        <div class="flex items-center mb-6">
          <h2 class="text-3xl font-bold text-headerText flex-1 text-center">Przeglądaj zespoły</h2>
          <button
              v-show="canManage()"
              @click="showCreateModal = true"
              class="px-4 py-2 flex items-center"
          >
            <i class="pi pi-plus mr-2"></i>
          </button>
        </div>

        <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
          <PulseLoader/>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <template v-if="Array.isArray(state.teams) && state.teams.length">
            <TeamListing
                v-for="team in state.teams.slice(0, limit || state.teams.length)"
                :key="team.teamId"
                :team="team"
            />
          </template>
          <div v-else class="text-gray-500 text-center">
            <i class="pi pi-info-circle mr-2"></i>
            <h4>Brak zespołów</h4>
          </div>
        </div>
      </div>
    </section>

    <CreateTeamModal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @team-created="fetchTeams"
    />
  </section>
</template>