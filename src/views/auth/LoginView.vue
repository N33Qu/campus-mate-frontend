<!-- LoginView.vue -->
<script setup>
import Box from "@/components/ui/Box.vue";
import { useLoginForm } from '@/composables/useLoginForm.js';

const {
  email,
  emailProps,
  password,
  passwordProps,
  showPassword,
  errors,
  togglePasswordVisibility,
  onSubmit
} = useLoginForm();
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
                :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
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