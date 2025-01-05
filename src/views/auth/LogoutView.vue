<script setup>
import Box from "@/components/Box.vue";
import Button from "@/components/Button.vue";
import { useAuth } from '@/services/authService.js';

const { logout, isLoading, error } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<template>
<Box>
  <h2 class="text-3xl text-center font-semibold mb-6 text-headerText">Czy na pewno chcesz sie wylogowac?</h2>
  <div class="flex justify-center">
    <Button to="/" text="Powrót do strony głównej"/>
    <Button @click="handleLogout" text="Wyloguj"/>
  </div>
</Box>
</template>
