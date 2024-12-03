<script setup>
import router from '@/router';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/axios.js';

const form = ref({
  userName: '',
  password: '',
});

const toast = useToast();

const handleSubmit = async () => {
  const credentials = {
    userName: form.userName,
    password: form.password,
  };

  try {
    const response = await api.post('/auth/authenticate', credentials);
  console.log(response)
    console.log(response.data)
    const cookieHeader = response.headers.get('Set-Cookie');
    console.log('Cookie Header:', cookieHeader);
    const cookies = document.cookie.split(';');
    const jwt = cookies.find(cookie => cookie.trim().startsWith('jwt='));
    console.log(jwt);
    if (cookieHeader) {
      // Set the cookie in the browser
      document.cookie = cookieHeader;
    }

    toast.success(response);
    await router.push(`/`);
  } catch (error) {
    console.error('Error logging in', error);
    toast.error('Bład logowania');
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
            <label for="userName" class="block text-gray-700 font-bold mb-2"
            >Email</label
            >
            <input
                type="text"
                v-model="form.userName"
                id="userName"
                name="userName"
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
            ></input>
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