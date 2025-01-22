<script setup>
import FullCalendar from '@fullcalendar/vue3'
import { ref, onMounted } from 'vue'
import { useCalendar } from '@/composables/calendar/useCalendar.js'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import EventModal from '@/components/calendar/EventModal.vue'

const currentGroup = ref(null)
const groups = ref([])
const isLoadingGroups = ref(true)

const {
  modalMode,
  selectedEvent,
  isEventModalOpen,
  isLoading,
  error,
  calendarOptions,
  isLoggedIn,
  closeEventModal,
  createEvent,
  refreshEvents,
  updateEvent,
  deleteEvent
} = useCalendar()

const fetchUserGroup = async () => {
  try {
    const response = await fetch('/api/user/group', {
      credentials: 'include'
    })
    if (response.ok) {
      const data = await response.json()
      return data.group
    }
    return null
  } catch (error) {
    console.error('Error fetching user group:', error)
    return null
  }
}

const fetchGroups = async () => {
  try {
    const response = await fetch('/api/schedule', {
      credentials: 'include'
    })
    if (response.ok) {
      const schedules = await response.json()
      groups.value = [...new Set(schedules.map(schedule => schedule.group))]
      return groups.value
    }
    return []
  } catch (error) {
    console.error('Error fetching groups:', error)
    return []
  }
}

const initializeCalendar = async () => {
  isLoadingGroups.value = true
  try {
    await fetchGroups()
    
    if (isLoggedIn) {
      const userGroup = await fetchUserGroup()
      currentGroup.value = userGroup || groups.value[0]
    } else {
      currentGroup.value = groups.value[0]
    }

    // Update calendar options with the selected group
    if (calendarOptions.value) {
      calendarOptions.value = {
        ...calendarOptions.value,
        events: async (info, successCallback, failureCallback) => {
          try {
            const response = await fetch(`/api/schedule/${currentGroup.value}`)
            if (response.ok) {
              const events = await response.json()
              successCallback(events)
            } else {
              failureCallback('Failed to fetch events')
            }
          } catch (error) {
            failureCallback(error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error initializing calendar:', error)
  } finally {
    isLoadingGroups.value = false
  }
}

const handleEditMode = () => {
  modalMode.value = 'edit'
}

const handleUpdateEvent = async (updatedEvent) => {
  await updateEvent(updatedEvent)
  modalMode.value = 'view'
  await refreshEvents()
}

const handleDeleteEvent = async () => {
  await deleteEvent(selectedEvent.value.eventId)
  modalMode.value = 'view'
  closeEventModal()
  await refreshEvents()
}

const handleCreateEvent = async (eventData) => {
  await createEvent(eventData)
  modalMode.value = 'view'
  await refreshEvents()
}

const handleCloseModal = () => {
  modalMode.value = 'view'
  closeEventModal()
}

onMounted(() => {
  initializeCalendar()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-elementLight rounded-lg shadow-lg p-6">
      <div v-if="isLoadingGroups" class="flex justify-center py-8">
        <RiseLoader color="#8b5cf6"/>
      </div>
      
      <template v-else>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ isLoggedIn ? 'Mój kalendarz' : 'Kalendarz' }}
          </h2>
          <p v-if="currentGroup" class="text-gray-600 mt-2">
            Grupa: {{ currentGroup }}
          </p>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
          <RiseLoader color="#8b5cf6"/>
        </div>

        <template v-else>
          <div v-if="!isLoggedIn" class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p class="text-blue-700">
              <span class="font-medium">Wyświetlany jest domyślny plan.</span>
              <a href="/login" class="ml-2 underline">Zaloguj się</a>, aby zobaczyć swój kalendarz.
            </p>
          </div>

          <FullCalendar :options="calendarOptions"/>

          <EventModal
              v-if="isEventModalOpen"
              :selected-event="selectedEvent"
              :is-open="isEventModalOpen"
              :mode="modalMode"
              @close="handleCloseModal"
              @edit="handleEditMode"
              @update="handleUpdateEvent"
              @delete="handleDeleteEvent"
              @create="handleCreateEvent"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style>