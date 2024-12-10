<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import BackButton from '@/components/TextButton.vue';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue';
import api from '@/axios.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const postId = route.params.id;

// Validation schema
const validationSchema = yup.object({
  postTitle: yup.string()
      .required('Tytuł jest wymagany')
      .min(5, 'Tytuł musi mieć co najmniej 5 znaków')
      .max(100, 'Tytuł nie może przekraczać 100 znaków'),
  postContent: yup.string()
      .required('Treść jest wymagana')
      .min(10, 'Treść musi mieć co najmniej 10 znaków')
});

// Use Vee-Validate
const { handleSubmit, errors, defineField } = useForm({
  validationSchema
});

// Define form fields with Vee-Validate
const [author, authorProps] = defineField('author');
const [postTitle, postTitleProps] = defineField('postTitle');
const [postContent, postContentProps] = defineField('postContent');

// Loading state
const isLoading = ref(true);
const isSaving = ref(false);

// Fetch post data on component mount
onMounted(async () => {
  try {
    const response = await api.get(`/post/${postId}`);
    postTitle.value = response.data.postTitle;
    postContent.value = response.data.postContent;
  } catch (error) {
    console.error('Error fetching post', error);
    toast.error('Błąd pobierania ogłoszenia');
  } finally {
    isLoading.value = false;
  }
});

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true;
  try {
    await api.put(`/post/${postId}`, {
      postTitle: values.postTitle,
      postContent: values.postContent
    });

    toast.success('Ogłoszenie zaktualizowane pomyślnie');
    await router.push(`/posts/${postId}`);
  } catch (error) {
    console.error('Error updating post', error);
    toast.error('Błąd aktualizacji ogłoszenia');
  } finally {
    isSaving.value = false;
  }
});
</script>

<template>
  <div class="bg-violet-50 min-h-screen py-10">
    <div class="container mx-auto px-6">
      <BackButton
          :to="`/posts/${postId}`"
          text="Powrót do Ogłoszeń"
          icon="pi pi-arrow-circle-left"
      />

      <div v-if="isLoading" class="text-center text-gray-500 py-6">
        <RiseLoader color="#8b5cf6" />
      </div>

      <form v-else @submit.prevent="onSubmit" class="max-w-2xl mx-auto">
        <div class="bg-white shadow-md rounded-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-center">Edytuj Ogłoszenie</h2>

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
            {{ isSaving ? 'Updating...' : 'Update Post' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>