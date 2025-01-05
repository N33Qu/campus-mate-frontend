<script setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import BackButton from '@/components/TextButton.vue';
import AddButton from '@/components/TextButton.vue'
import {ref, onMounted} from "vue";
import {useRoute, RouterLink, useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import api from '@/config/axiosConfig.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const teamId = route.params.id;

const team = ref({
  teamId: Number,
  teamName: String,
  description: String,
}
);
const users = ref([
  {
    email: String,
    firstName: String,
    lastName: String,
    role: String
  }
]);
const posts = ref([
  {
    postId: Number,
    postTitle: String,
    postContent: String,
    createdAt: String,
    updatedAt: String
  }
]);
const events = ref([
  {
    eventName: String,
    eventDescription: String,
    startDate: String,
    endDate: String
  }
]);
const isLoading = ref(true);

const deleteTeam = async () => {
  try {
    const confirm = window.confirm('Czy na pewno chcesz usunąć ten zespół?');
    if (confirm) {
      await api.delete(`/team/${teamId}`);
      toast.success('Zespół został usunięty');
      await router.push('/teams');
    }
  } catch (error) {
    console.error('Error deleting post', error);
    toast.error('Wystąpił błąd podczas usuwania zespołu')
  }
};

const removeUser = async (userId) => {
  try {
    await api.delete(`/team/${teamId}/removeUser/${userId}`);
    users.value = users.value.filter(user => user.userId !== userId);
    toast.success('Użytkownik usunięty pomyślnie');
  } catch (error) {
    toast.error('Wystąpił błąd podczas usuwania użytkownika');
  }
};

const addUser = async (userId) => {
  try {
    await api.post(`/team/${teamId}/addUser/${userId}`);
    const response = await api.get(`/team/${teamId}/users`);
    users.value = response.data;
    toast.success('Użytkownik został dodany pomyślnie');
  } catch (error) {
    toast.error('Wystąpił błąd podczas dodawania użytkownika');
  }
};

onMounted(async () => {
  try {
    const [teamResponse, usersResponse, postsResponse, eventsResponse] = await Promise.all([
      api.get(`/team/${teamId}`),
      api.get(`team/${teamId}/users`),
      api.get(`team/${teamId}/posts`),
      api.get(`team/${teamId}/events`)
    ]);

    team.value = teamResponse.data;
    console.log(team.value)
    console.log(team.value.teamName)
    console.log(team.value.description)

    users.value = usersResponse.data;
    posts.value = postsResponse.data;
    events.value = eventsResponse.data;
  } catch (error) {
    console.error('Error fetching team data', error);
    toast.error('Wystąpił problem podczas pobierania danych zespołu');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <BackButton :to="`/teams`" text="Powrót do Zespołów" icon="pi pi-arrow-circle-left"/>
  <AddButton :to="`/teams/add-users`" text="Dodaj użytkowników" icon="pi pi-user-plus"/>
  <section v-if="!isLoading" class="bg-green-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div class="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <h1 class="text-3xl font-bold mb-4">{{ team.teamName }}</h1>
            <p>{{ team.description }}</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-4">Team Members</h3>
            <ul v-if="users.length" class="space-y-2">
              <li v-for="user in users" :key="user.userId" class="flex justify-between items-center">
                <span>{{ user.firstName }} {{ user.lastName }}</span>
                <button @click="removeUser(user.userId)"
                        class="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </li>
            </ul>
            <p v-else>No members yet</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-4">Team Posts</h3>
            <div v-if="posts.length" class="space-y-4">
              <div v-for="post in posts" :key="post.postId"
                   class="p-4 border rounded">
                {{ post.content }}
              </div>
            </div>
            <p v-else>No posts yet</p>
          </div>
        </main>

        <aside>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">Team Events</h3>
            <div v-if="events.length" class="space-y-2">
              <div v-for="event in events" :key="event.eventId"
                   class="p-2 bg-gray-50 rounded">
                {{ event.name }}
              </div>
            </div>
            <p v-else>No events scheduled</p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage Team</h3>
            <RouterLink
                :to="`/teams/edit/${team.teamId}`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline block">
              Edit Team
            </RouterLink>
            <button
                @click="deleteTeam"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block">
              Delete Team
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div v-else class="text-center text-gray-500 py-6">
    <PulseLoader/>
  </div>
</template>
