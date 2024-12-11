<script setup>
import HomeCard from "@/components/home/HomeCard.vue";

const homeCards = [
  {
    title: 'Twoje zespoły',
    icon: 'pi pi-users',
    description: 'Zobacz swoje zespoły i członków.',
    to: '/teams',
    buttonText: 'Przeglądaj Zespoły',
    bg: 'bg-gray-100',
  },
  {
    title: 'Twój Plan',
    icon: 'pi pi-server',
    description: 'Przeglądaj swoje zajęcia.',
    to: '/schedule',
    buttonText: 'Przeglądaj Plan',
    bg: 'bg-element',
  },
  {
    title: 'Twój Kalendarz',
    icon: 'pi pi-calendar',
    description: 'Przeglądaj nadchodzące i przeszłe wydarzenia.',
    to: '/calendar',
    buttonText: 'Przeglądaj Kalendarz',
    bg: 'bg-element',
  },
  {
    title: 'Twoje Oceny',
    icon: 'pi pi-chart-line',
    description: 'Przeglądaj swoje oceny.',
    to: '/grades',
    buttonText: 'Przeglądaj Oceny',
    bg: 'bg-gray-100',
  },
]
</script>

<template>
  <section class="py-4 bg-appBg">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <HomeCard v-for="card in homeCards" :key="card.title" :card="card" />
      </div>
    </div>
  </section>
</template>