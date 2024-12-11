<script setup>
import {ref, computed, onMounted} from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import api from '@/axios.js'
import {useAuthStore} from '@/stores/authStore'

// State
const authStore = useAuthStore()
const calendar = ref(null)
const selectedEvent = ref(null)
const isEventModalOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)

// Fetch Calendar
const fetchCalendar = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.get(`/calendars/user/${authStore.userId}`)
    console.log("respose data: " + response.data)
    calendar.value = response.data
    console.log(calendar.value)
  } catch (err) {
    error.value = 'Failed to fetch calendar'
    console.error('Error fetching calendar:', err)
  } finally {
    isLoading.value = false
  }
}

// Calendar Events Fetcher
const fetchEvents = async () => {
  if (!calendar.value) return []

  try {
    const response = await api.get(`/events/${calendar.value.id}`)
    return response.data.map(event => ({
      id: event.id,
      title: event.eventName,
      start: event.startDate,
      end: event.endDate,
      description: event.description
    }))
  } catch (err) {
    error.value = 'Failed to fetch events'
    console.error('Error fetching events:', err)
    return []
  }
}

// Calendar Configuration
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  eventClick: handleEventClick,
  events: fetchEvents
}))

// Event Handling
const handleEventClick = (clickInfo) => {
  selectedEvent.value = {
    title: clickInfo.event.title,
    description: clickInfo.event.extendedProps.description || 'No description',
    start: clickInfo.event.startStr,
    end: clickInfo.event.endStr
  }
  isEventModalOpen.value = true
}

// Close Event Modal
const closeEventModal = () => {
  isEventModalOpen.value = false
  selectedEvent.value = null
}

// Fetch calendar on component mount
onMounted(fetchCalendar)
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