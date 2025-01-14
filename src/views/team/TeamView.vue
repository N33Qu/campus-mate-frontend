<script setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import BackButton from '@/components/ui/TextButton.vue';
import AddButton from '@/components/ui/TextButton.vue';
import { ref, onMounted } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import api from '@/config/axiosConfig.js';


const route = useRoute();
const router = useRouter();
const toast = useToast();

const teamId = route.params.id;
const showAddUsersModal = ref(false);

const handleUsersAdded = () => {
  fetchTeamData();
};


const state = ref({
  team: {
    teamName: '',
    description: '',
    teamId: ''
  },
  users: [],
  posts: [],
  isLoading: true,
});

const deleteTeam = async () => {
  if (!confirm('Czy na pewno chcesz usunąć ten zespół?')) return;
  
  try {
    await api.delete(`/team/${teamId}`);
    toast.success('Zespół usunięty pomyślnie');
    await router.push('/teams');
  } catch (error) {
    console.error('Error deleting team:', error);
    toast.error('Błąd usuwania zespołu');
  }
};

const removeUser = async (userId) => {
  if (!confirm('Czy na pewno chcesz usunąć tego użytkownika z zespołu?')) return;

  try {
    state.value.isLoading = true; 
    
    await api.delete(`/team/${teamId}/removeUser/${userId}`); 

    const usersResponse = await api.get(`/teams/${teamId}/users`);
    state.value.users = usersResponse.data;
    
    toast.success('Użytkownik został usunięty z zespołu');
  } catch (error) {
    if(error.response.status === 400) {
      toast.error('Nie mozna usunąć twórcy zespołu');
    }
    else{
      console.error('Error removing user:', error);
      toast.error('Nie udało się usunąć użytkownika z zespołu');
    }
  } finally {
    state.value.isLoading = false;
  }
};

const fetchTeamData = async () => {
  try {
    const [teamResponse, usersResponse, postsResponse] = await Promise.all([
      api.get(`/team/${teamId}`),
      api.get(`/team/${teamId}/users`),
      api.get(`/team/${teamId}/posts`)
    ]);

    state.value.team = teamResponse.data;
    state.value.users = usersResponse.data;
    state.value.posts = postsResponse.data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    toast.error('Błąd pobierania danych zespołu');
    router.push('/teams');
  } finally {
    state.value.isLoading = false;
  }
};

onMounted(fetchTeamData);
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="flex gap-4 mb-6">
      <BackButton :to="`/teams`" text="Powrót do Zespołów" icon="pi pi-arrow-circle-left" />
      <TeamAddUsersModal
          :teamId="teamId"
          :isOpen="showAddUsersModal"
          @close="showAddUsersModal = false"
          @usersAdded="handleUsersAdded"
        />
      <AddButton @click="showAddUsersModal = true" text="Dodaj użytkowników" icon="pi pi-user-plus" />
    </div>

    <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
      <PulseLoader />
    </div>

    <section v-else class="bg-green-50 p-6 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6">
        <!-- Left Column - Team Info and Posts -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold mb-3">{{ state.team.teamName || 'Brak nazwy' }}</h1>
            <p class="text-gray-600 mb-6">{{ state.team.description || 'Brak opisu' }}</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Posty zespołu</h2>
            <div v-if="state.posts.length" class="space-y-4">
              <div v-for="post in state.posts" 
                   :key="post.postId"
                   class="p-4 border rounded hover:bg-gray-50">
                {{ post.content }}
              </div>
            </div>
            <p v-else class="text-gray-500">Brak postów</p>
          </div>
        </div>

        <!-- Right Column - Users and Management -->
        <div class="space-y-6">
          <!-- Users List -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Członkowie zespołu</h2>
            <div class="max-h-60 overflow-y-auto pr-2">
              <ul v-if="state.users.length" class="space-y-2">
                <li v-for="user in state.users" 
                    :key="user.userId" 
                    class="flex justify-between items-center p-2 hover:bg-gray-50 rounded border">
                  <span>{{ user.firstName }} {{ user.lastName }}</span>
                  <button 
                    @click="removeUser(user.userId)"
                    class="text-red-500 hover:text-red-700 px-3 py-1 rounded"
                    :disabled="state.isLoading"
                  >
                    {{ state.isLoading ? 'Usuwanie...' : 'Usuń' }}
                  </button>
                </li>
              </ul>
              <p v-else class="text-gray-500">Brak członków zespołu</p>
            </div>
          </div>

          <!-- Team Management -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-6">Zarządzanie zespołem</h2>
            <div class="space-y-4">
              <RouterLink
                :to="`/teams/edit/${state.team.teamId}`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full block transition-colors duration-200">
                Edytuj zespół
              </RouterLink>
              <button
                @click="deleteTeam"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors duration-200">
                Usuń zespół
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>