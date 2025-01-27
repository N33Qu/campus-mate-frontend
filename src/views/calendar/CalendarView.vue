<script setup>
import FullCalendar from '@fullcalendar/vue3'
import {useCalendar} from '@/composables/calendar/useCalendar.js'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import EventModal from '@/components/calendar/EventModal.vue'
import {usePermissions} from "@/composables/calendar/useEventPermissions.js";

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

const { canEdit, canView} = usePermissions()

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
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-elementLight rounded-lg shadow-lg p-6">
      <div v-if="!isLoggedIn" class="text-center text-gray-500 py-4">
        <a href="/login">Zaloguj się</a>, aby zobaczyć kalendarz
      </div>
      <template v-else-if="!canView">
        <div class="text-center text-gray-500 py-4">
          Nie masz uprawnień do wyświetlania kalendarza
        </div>
      </template>
      <template v-else>
        <div v-if="isLoading" class="flex justify-center py-8">
          <RiseLoader color="#8b5cf6"/>
        </div>

        <div v-else>
          <h2 class="text-2xl font-bold mb-6 text-gray-800">
            Mój kalendarz
            <span v-if="canEdit" class="text-sm font-normal text-gray-500">
              (tryb edycji)
            </span>
          </h2>
          <FullCalendar :options="calendarOptions"/>
        </div>

        <EventModal
            v-if="isEventModalOpen"
            :selected-event="selectedEvent"
            :is-open="isEventModalOpen"
            :mode="modalMode"
            :can-edit="canEdit"
            @close="handleCloseModal"
            @edit="handleEditMode"
            @update="handleUpdateEvent"
            @delete="handleDeleteEvent"
            @create="handleCreateEvent"
        />
      </template>
    </div>
  </div>
</template>