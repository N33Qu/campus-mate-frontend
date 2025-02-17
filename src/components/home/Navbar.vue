<script setup>
import { ref, onMounted, onBeforeUnmount, computed} from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import logo from '@/assets/img/logo.png';
import 'primeicons/primeicons.css';
import { useAuthStore } from '@/stores/authStore.js';

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isTokenValid);
const userRole = computed(() => authStore.userRole);
const userId = computed(() => authStore.userId);

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const isMenuOpen = ref(false);
const isNavbarVisible = ref(true);
let lastScrollPosition = 0;

const menuLinks = {
  admin: [
    { path: '/adminPanel', label: 'Panel Administratora', icon: 'pi pi-cog' },
  ],
  user: [
    { path: '/', label: 'Strona Główna', icon: 'pi pi-home' },
    { path: '/calendar', label: 'Kalendarz', icon: 'pi pi-calendar' },
    { path: '/grades', label: 'Oceny', icon: 'pi pi-chart-line' },
    { path: '/posts', label: 'Ogłoszenia', icon: 'pi pi-file' },
    { path: '/teams', label: 'Zespoły', icon: 'pi pi-users' },
  ],
  common: [
    { path: '/addressbook', label: 'Książka Adresowa', icon: 'pi pi-address-book' },
    { path: '/schedule', label: 'Plan', icon: 'pi pi-server' },
  ]
};

const links = computed(() => {
  let baseLinks = [];

  if (isLoggedIn.value) {
    if (userRole.value !== 'ROLE_ADMIN') {
      baseLinks.push({ path: '/', label: 'Strona Główna', icon: 'pi pi-home' });
    }

    const otherLinks = [
      ...(userRole.value === 'ROLE_ADMIN' ? menuLinks.admin : menuLinks.user.slice(1)),
      ...menuLinks.common.map(link => ({
        ...link,
        path: typeof link.path === 'function' ? link.path(userId.value) : link.path
      }))
    ].sort((a, b) => a.label.localeCompare(b.label));

    baseLinks = [...baseLinks, ...otherLinks];
    baseLinks.push({ path: '/profile/' + userId.value, label: 'Profil', icon: 'pi pi-user' });
    baseLinks.push({ path: '/logout', label: 'Wyloguj Się', icon: 'pi pi-sign-out' });
  } else {
    baseLinks = [{ path: '/login', label: 'Zaloguj Się', icon: 'pi pi-sign-in' }];
  }

  return baseLinks;
});

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  isNavbarVisible.value = !(currentScrollPosition > lastScrollPosition && currentScrollPosition > 100);
  lastScrollPosition = currentScrollPosition;
};

const closeMenuOnScroll = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('scroll', closeMenuOnScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', closeMenuOnScroll);
});
</script>

<template>
  <nav
      class="bg-zinc-900 border-b border-zinc-700 fixed top-0 left-0 w-full z-0 transition-transform duration-300"
      :class="isNavbarVisible ? 'translate-y-0' : '-translate-y-full'"
  >
    <div class="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center flex-grow">
          <RouterLink class="flex items-center mr-4" to="/">
            <img class="h-12 w-auto" :src="logo" alt="Campus Mate" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2">
              CampusMate
            </span>
          </RouterLink>
        </div>

        <!-- Hamburger menu button - tylko dla zalogowanych -->
        <div v-if="isLoggedIn" class="xl:hidden">
          <button
              @click="isMenuOpen = !isMenuOpen"
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
          >
            <span class="sr-only">Toggle main menu</span>
            <i
                :class="[isMenuOpen ? 'pi pi-times' : 'pi pi-bars', 'text-2xl text-gray-400 hover:text-white']"
            ></i>
          </button>
        </div>

        <!-- Desktop menu - zawsze widoczne dla niezalogowanych, dla zalogowanych tylko na xl -->
        <div :class="[isLoggedIn ? 'hidden xl:flex xl:flex-1 lg:space-x-8 xl:space-x-10' : 'flex lg:space-x-8 xl:space-x-16']">
          <RouterLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              :class="[
              isActiveLink(link.path) ? 'bg-stone-800 text-white' : 'text-gray-300 hover:bg-stone-700 hover:text-white',
              'px-3 py-2 rounded-md text-lg font-medium transition whitespace-nowrap flex items-center'
            ]"
          >
            <div class="flex items-center">
              <i v-if="link.icon" :class="[link.icon, 'mr-2']"></i>
              <span>{{ link.label }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Mobile menu - tylko dla zalogowanych -->
    <div v-if="isLoggedIn && isMenuOpen" id="mobile-menu" class="xl:hidden bg-zinc-800 border-t border-zinc-800">
      <div class="space-y-1 px-4 py-2">
        <RouterLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            :class="[
            isActiveLink(link.path) ? 'bg-stone-800 text-white' : 'text-gray-300 hover:bg-stone-700 hover:text-white',
            'block px-3 py-2 rounded-md text-lg font-medium transition'
          ]"
        >
          <div class="flex items-center">
            <i v-if="link.icon" :class="link.icon" class="mr-2"></i>
            <span>{{ link.label }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>