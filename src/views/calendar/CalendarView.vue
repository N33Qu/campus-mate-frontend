<script setup>
import FullCalendar from '@fullcalendar/vue3'
import { useCalendar } from '@/services/calendarService.js'

const {
  calendar,
  selectedEvent,
  isEventModalOpen,
  isLoading,
  error,
  calendarOptions,
  closeEventModal
} = useCalendar()
</script>

<template>
  <section class="bg-appBg h-screen">
    <div class="container m-auto lg:max-w-8xl max-2xl:w-10xl py-24">
      <div class="bg-elementLight px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-gray-500 py-4">
          Loading calendar...
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center text-red-500 py-4">
          {{ error }}
        </div>

        <!-- Calendar Display -->
        <template v-if="!isLoading && calendar">
          <h2 class="text-3xl text-center font-semibold mb-4 text-headerText">
            {{ calendar.name }}
          </h2>
          <FullCalendar :options="calendarOptions"/>
        </template>

        <!-- No Calendar Message -->
        <div v-if="!isLoading && !calendar" class="text-center text-gray-500 py-4">
          No calendar found
        </div>

        <!-- Event Details Modal -->
        <div
            v-if="isEventModalOpen"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-2xl font-bold mb-4">{{ selectedEvent.title }}</h3>
            <p class="mb-2"><strong>Description:</strong> {{ selectedEvent.description }}</p>
            <p class="mb-2"><strong>Start:</strong> {{ selectedEvent.start }}</p>
            <p class="mb-4"><strong>End:</strong> {{ selectedEvent.end }}</p>
            <button
                @click="closeEventModal"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>