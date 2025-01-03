<script setup>
import router from '@/router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref } from 'vue';
import {login} from '@/axios.js';
import Box from "@/components/Box.vue";
import {useToastStore} from "@/stores/toastStore.js";


const validationSchema = yup.object({
  email: yup
      .string()
      .required('Email jest wymagany')
      .email('Nieprawidłowy format email'),
  password: yup
      .string()
      .required('Hasło jest wymagane')
      .min(6, 'Hasło musi mieć co najmniej 6 znaków')
      .matches('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?]{6,}$', 'Hasło musi zawierać co najmniej jedną dużą literę, małą literę, cyfrę i znak specjalny')
});


const { handleSubmit, errors, defineField } = useForm({
  validationSchema: validationSchema
});

const [email, emailProps] = defineField('email');
const [password, passwordProps] = defineField('password');

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await login({
      email: values.email,
      password: values.password,
    });
  } catch (error) {
    console.error();
  }
});
</script>

<template>
  <Box>
    <form @submit.prevent="onSubmit">
      <h2 class="text-3xl text-center font-semibold mb-6">Logowanie</h2>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 font-bold mb-2">
          Email
        </label>
        <input
            type="text"
            v-model="email"
            v-bind="emailProps"
            id="email"
            name="email"
            class="border rounded w-full py-2 px-3 mb-1"
            placeholder="email@domain.com"
            autocomplete="current-email"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </p>
      </div>

      <div class="mb-4 relative">
        <label for="password" class="block text-gray-700 font-bold mb-2">
          Hasło
        </label>
        <div class="relative">
          <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              v-bind="passwordProps"
              id="password"
              name="password"
              class="border rounded w-full py-2 px-3 mb-1 pr-10"
              placeholder="Wprowadź hasło"
              autocomplete="current-password"
          />
          <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              aria-label="Pokaż/ukryj hasło"
          >
            <i
                :class="showPassword
                ? 'pi pi-eye-slash'
                : 'pi pi-eye'"
                class="text-xl"
            ></i>
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </p>
      </div>

      <div>
        <button
            class="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
        >
          Zaloguj się
        </button>
      </div>
    </form>
  </Box>
</template>