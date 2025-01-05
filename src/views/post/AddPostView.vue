<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import BackButton from '@/components/TextButton.vue';
import api from '@/config/axiosConfig.js';

const router = useRouter();
const toast = useToast();

// Teams multiselect
const teams = ref([]);
const selectedTeams = ref([]);

// Fetch teams on component mount
onMounted(async () => {
  try {
    const response = await api.get('/teams');
    teams.value = response.data;
  } catch (error) {
    console.error('Error fetching teams', error);
    toast.error('Błąd pobierania zespołów');
  }
});

// Validation schema
const validationSchema = yup.object({
  postTitle: yup.string()
      .required('Tytuł jest wymagany')
      .min(5, 'Tytuł musi mieć co najmniej 5 znaków')
      .max(100, 'Tytuł musi mieć co najmniej 100 znaków'),
  postContent: yup.string()
      .required('Treść jest wymagana')
      .min(10, 'Treść musi mieć co najmniej 10 znaków'),
  teams: yup.array()
      .min(1, 'Wybierz przynajmniej jeden zespół')
});

// Use Vee-Validate
const { handleSubmit, errors, defineField } = useForm({
  validationSchema
});

// Define form fields with Vee-Validate
const [postTitle, postTitleProps] = defineField('postTitle');
const [postContent, postContentProps] = defineField('postContent');
const [formTeamsProps] = defineField('teams');

// Loading state
const isSaving = ref(false);

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  try {
    const response = await api.post('/post', {
      postTitle: values.postTitle,
      postContent: values.postContent,
      teams: values.teams
    });
    console.log(response.data.message);
    toast.success('Ogłoszenie utworzone pomyślnie');
    await router.push(`/posts`); //TODO: redirect to new post
  } catch (error) {
    console.error('Error creating post', error);
    toast.error('Bład tworzenia ogłoszenia');
  } finally {
    isSaving.value = false;
  }
});
</script>

<template>
  <div class="bg-element min-h-screen py-10">
    <div class="container mx-auto px-6">
      <BackButton
          to="/posts"
          text="Wszyskie Ogłosezenia"
          icon="pi pi-arrow-circle-left"
      />

      <form @submit.prevent="onSubmit" class="max-w-2xl mx-auto">
        <div class="bg-elementLight shadow-md rounded-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-center text-headerText">Napisz Ogłoszenie</h2>

          <div class="mb-4">
            <label
                for="teams"
                class="block text-gray-700 text-sm font-bold mb-2"
            >
              Wybierz zespoły docelowe
            </label>
            <select
                id="teams"
                v-model="selectedTeams"
                v-bind="formTeamsProps"
                multiple
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-appBg"
            >
              <option
                  v-for="team in teams"
                  :key="team.id"
                  :value="team.id"
              >
                {{ team.name }}
              </option>
            </select>
            <p v-if="errors.teams" class="text-red-500 text-sm mt-1">
              {{ errors.teams }}
            </p>
          </div>

          <div class="mb-4">
            <label
                for="title"
                class="block text-gray-700 text-sm font-bold mb-2"
            >
              Tytuł
            </label>
            <input
                id="title"
                v-model="postTitle"
                v-bind="postTitleProps"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-appBg"
                placeholder="Enter post title"
            />
            <p v-if="errors.postTitle" class="text-red-500 text-sm mt-1">
              {{ errors.postTitle }}
            </p>
          </div>

          <div class="mb-6">
            <label
                for="content"
                class="block text-gray-700 text-sm font-bold mb-2"
            >
              Treść
            </label>
            <textarea
                id="content"
                v-model="postContent"
                v-bind="postContentProps"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-appBg"
                placeholder="Write your post content here"
            ></textarea>
            <p v-if="errors.postContent" class="text-red-500 text-sm mt-1">
              {{ errors.postContent }}
            </p>
          </div>

          <button
              type="submit"
              :disabled="isSaving"
              class="w-full bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            {{ isSaving ? 'Tworzenie...' : 'Napisz Ogłoszenie' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>