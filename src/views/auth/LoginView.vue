<script setup>
import router from '@/router';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import {login} from '@/axios.js';

const form = ref({
  email: '',
  password: '',
});

const toast = useToast();

const handleSubmit = async () => {
  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    });

    toast.success('Zalogowano pomyślnie!');
    await router.push('/'); // Przekierowanie do strony głównej
  } catch (error) {
    console.error('Błąd logowania:', error);
    toast.error('Nieprawidłowe dane logowania.');
  }
};
</script>

<template>
  <section class="bg-appBg h-screen">
    <div class="container m-auto max-w-2xl py-24">
      <div
          class="bg-elementLight px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Logowanie</h2>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2"
            >Email</label
            >
            <input
                type="text"
                v-model="form.email"
                id="email"
                name="email"
                class="border rounded w-full py-2 px-3 mb-2"
                placeholder="email@domain.com"
                required
                autocomplete="current-email"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-bold mb-2"
            >Hasło</label
            >
            <input
                type="password"
                id="password"
                v-model="form.password"
                name="password"
                class="border rounded w-full py-2 px-3"
                placeholder="password"
                required
                autocomplete="current-password"
            />
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
      </div>
    </div>
  </section>
</template>