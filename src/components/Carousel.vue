<script setup>
// Tworzymy tablicę obrazów, które będą wyświetlane w karuzeli
const images = Array.from({ length: 12 }, (_, i) => `/src/assets/img/${i + 1}.jpg`);
</script>

<template>
  <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    <!-- Wskaźniki slajdów -->
    <div class="carousel-indicators">
      <button
          v-for="(image, index) in images"
          :key="index"
          type="button"
          data-bs-target="#carouselExample"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-label="`Slide ${index + 1}`"
      ></button>
    </div>

    <!-- Obrazy -->
    <div class="carousel-inner">
      <div
          v-for="(image, index) in images"
          :key="index"
          class="carousel-item"
          :class="{ active: index === 0 }"
      >
        <!-- Obrazki rozciągają się na całą szerokość ekranu, z większą wysokością -->
        <img :src="image" class="d-block w-100" :alt="`Slide ${index + 1}`" />
      </div>
    </div>

    <!-- Przyciski nawigacyjne -->
    <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
.carousel {
  /* Zwiększamy wysokość karuzeli */
  width: 100%;
  height: 70vh; /* Ustawiamy karuzelę na 70% wysokości ekranu */
  margin-bottom: 20px; /* Zapewnia przestrzeń poniżej karuzeli */
}

.carousel-item img {
  /* Obrazki rozciągają się na całą szerokość ekranu, ale z zachowaniem proporcji */
  width: 100%;
  height: 100%;
  object-fit: cover; /* Obrazek wypełnia cały dostępny obszar, ale zachowuje proporcje */
}

/* Możesz również dodać max-height, jeśli chcesz ograniczyć maksymalną wysokość */
.carousel-inner {
  max-height: 100%; /* Można ograniczyć maksymalną wysokość */
  overflow: hidden; /* Obcinanie nadmiarowych elementów */
}
</style>
