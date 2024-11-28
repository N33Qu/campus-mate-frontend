<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import logo from '@/assets/img/logo.png';



// Sprawdzenie, czy link jest aktywny
const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
const visibleExternalContent = ref(false);

// Definicja linków
const links = [
  { path: '/', label: 'Home' },
  { path: '/addressbook', label: 'Address Book' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/grades', label: 'Grades' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/teams', label: 'Teams' },
  { path: '/user/:id', label: 'My Profile' },
];


</script>

<template>


</template>
