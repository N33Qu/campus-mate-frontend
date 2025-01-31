<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTeam } from '@/composables/team/useTeam';
import EditTeamModal from '@/components/team/EditTeamModal.vue';
import AddUsersModal from '@/components/team/AddUsersModal.vue';
import TeamUsersList from '@/components/team/TeamUsersList.vue';
import TeamPosts from '@/components/team/TeamPosts.vue';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal.vue';
import { usePermissions } from '@/composables/usePermissions';

const route = useRoute();
const teamId = route.params.id;

const {
  team,
  posts,
  isLoading,
  showEditModal,
  showAddUsersModal,
  showDeleteConfirmation,
  searchQuery,
  filteredUsers,
  fetchTeamData,
  updateTeam,
  removeUser,
  deleteTeam
} = useTeam(teamId);

onMounted(fetchTeamData);

const { canManage } = usePermissions();

const handleRemoveUser = (userId) => {
  if (userId === team.value?.creatorId) return;
  removeUser(userId);
};
</script>

<template>
  <div class="container mx-auto px-4 py-8 bg-elementLight rounded-lg m-6 max-w-screen-xl">
    <!-- Team Header Card -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-6 relative">
        <button
            @click="$router.back()"
            class="absolute left-6 top-6 p-2 text-gray-600 hover:text-gray-800"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
        <div class="flex justify-between items-start pt-2">
          <div class="space-y-2 ml-12">
            <h1 class="text-2xl font-bold">{{ team?.teamName }}</h1>
            <p v-if="team?.description" class="text-gray-600">
              {{ team.description.length > 50 ? team.description.substring(0, 50) + '...' : team.description }}
            </p>
          </div>
          <div v-show="canManage()" class="flex gap-2">
            <button
                @click="showEditModal = true"
                class="p-2 text-editButton hover:text-editButtonHover"
            >
              <i class="pi pi-pencil"></i>
            </button>
            <button
                @click="showDeleteConfirmation = true"
                class="p-2 text-deleteButton hover:text-deleteButtonHover"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <i class="pi pi-spinner animate-spin text-4xl text-gray-500"></i>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
      <TeamPosts
          :posts="posts"
          :team-id="teamId"
          @refresh="fetchTeamData"
      />

      <TeamUsersList
          :users="filteredUsers"
          :search-query="searchQuery"
          :creator-id="team?.creatorId"
          @remove-user="handleRemoveUser"
          @search="query => searchQuery = query"
          @add-users="showAddUsersModal = true"
      />
    </div>

    <!-- Modals -->
    <EditTeamModal
        v-if="showEditModal"
        :team="team"
        @close="showEditModal = false"
        @submit="updateTeam"
    />

    <AddUsersModal
        v-if="showAddUsersModal"
        :team-id="teamId"
        @close="showAddUsersModal = false"
        @users-added="fetchTeamData"
    />

    <DeleteConfirmationModal
        v-if="showDeleteConfirmation"
        :title="`Delete ${team?.name}`"
        :message="'Are you sure you want to delete this team? This action cannot be undone.'"
        @confirm="deleteTeam"
        @cancel="showDeleteConfirmation = false"
    />
  </div>
</template>