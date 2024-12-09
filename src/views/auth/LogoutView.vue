<script setup>
import {login, logout} from "@/axios.js";
import { useRouter } from 'vue-router';
import {useToast} from "vue-toastification";
import Box from "@/components/Box.vue";
import Button from "@/components/Button.vue";


const router = useRouter();
const toast = useToast();

const handleLogout = async () => {
  try {
    await logout();
    toast.success('Wylogowano pomyślnie!');
  } catch (error) {
    console.error('Błąd logowania:', error);
    toast.error('Błąd wylogowania.');
  }
  finally {
    await router.push('/');
  }
}
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
