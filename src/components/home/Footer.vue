<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-black text-gray-300 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between">
        <!-- Logo i opis -->
        <div class="mb-6 md:mb-0">
          <div class="flex items-center mb-4">
            <img src="../../assets/img/logo.png" alt="Campus Mate Logo" class="h-10 w-auto" />
            <span class="text-white text-2xl font-bold ml-3">CampusMate</span>
          </div>
          <p class="text-gray-400 text-sm max-w-xs">
            CampusMate pomaga studentom w organizacji ich planów zajęć, ocen, wydarzeń i zespołów.
          </p>
        </div>

        <!-- Szybkie linki -->
        <div class="mb-6 md:mb-0">
          <h3 class="text-white text-lg font-semibold mb-4">Szybkie Linki</h3>
          <ul>
            <li class="mb-2">
              <RouterLink to="/" class="hover:text-white">Strona Główna</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/about" class="hover:text-white">O Nas</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/contact" class="hover:text-white">Kontakt</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/faq" class="hover:text-white">FAQ</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Media społecznościowe -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Obserwuj Nas</h3>
          <div class="flex space-x-4">
            <a href="https://facebook.com" target="_blank" class="text-gray-400 hover:text-white">
              <i class="pi pi-facebook text-2xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" class="text-gray-400 hover:text-white">
              <i class="pi pi-twitter text-2xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" class="text-gray-400 hover:text-white">
              <i class="pi pi-instagram text-2xl"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" class="text-gray-400 hover:text-white">
              <i class="pi pi-linkedin text-2xl"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Dolna część stopki -->
      <div class="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {{year}} CampusMate. Wszystkie prawa zastrzeżone.
      </div>
    </div>
  </footer>
</template>
