import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { calendarService } from '@/services/calendarService'

export function useCalendar() {
    // State management for authentication and user context
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => authStore.isTokenValid)
    const userId = computed(() => authStore.userId)

    // Calendar state management
    const events = ref([])
    const selectedEvent = ref(null)
    const isEventModalOpen = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    // Configure calendar options with event handlers
    const calendarOptions = computed(() => ({
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: handleEventClick,
        events: events.value,
        height: 'auto',
        // Enable event dragging and resizing for better UX
        editable: true,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize
    }))

    // Event fetching and error handling
    const fetchEvents = async () => {
        if (!userId.value) {
            error.value = 'User not authenticated'
            return
        }

        isLoading.value = true
        error.value = null

        try {
            events.value = await calendarService.getEvents(userId.value)
        } catch (err) {
            error.value = 'Failed to fetch events'
            console.error('Error fetching events:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Event click handler for opening the modal
    const handleEventClick = (clickInfo) => {
        selectedEvent.value = {
            eventId: clickInfo.event.id,
            title: clickInfo.event.title,
            description: clickInfo.event.extendedProps.description || 'No description',
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr
        }
        isEventModalOpen.value = true
    }

    // Event update handler
    const updateEvent = async (updatedEvent) => {
        isLoading.value = true
        error.value = null

        try {
            await calendarService.updateEvent(updatedEvent.eventId, updatedEvent)

            // Update the local events array to reflect changes immediately
            events.value = events.value.map(event =>
                event.eventId === updatedEvent.eventId ? updatedEvent : event
            )

            // Show success feedback to user
            showNotification('Event updated successfully')
        } catch (err) {
            error.value = 'Failed to update event'
            console.error('Error updating event:', err)
            showNotification('Failed to update event', 'error')
        } finally {
            isLoading.value = false
        }
    }

    // Event deletion handler
    const deleteEvent = async (eventId) => {
        isLoading.value = true
        error.value = null

        try {
            await calendarService.deleteEvent(eventId)

            // Remove the event from local state
            events.value = events.value.filter(event => event.eventId !== eventId)

            showNotification('Event deleted successfully')
        } catch (err) {
            error.value = 'Failed to delete event'
            console.error('Error deleting event:', err)
            showNotification('Failed to delete event', 'error')
        } finally {
            isLoading.value = false
        }
    }

    // Handle drag-and-drop event updates
    const handleEventDrop = async (dropInfo) => {
        const updatedEvent = {
            eventId: dropInfo.event.id,
            title: dropInfo.event.title,
            description: dropInfo.event.extendedProps.description,
            start: dropInfo.event.startStr,
            end: dropInfo.event.endStr
        }

        await updateEvent(updatedEvent)
    }

    // Handle event resize updates
    const handleEventResize = async (resizeInfo) => {
        const updatedEvent = {
            eventId: resizeInfo.event.id,
            title: resizeInfo.event.title,
            description: resizeInfo.event.extendedProps.description,
            start: resizeInfo.event.startStr,
            end: resizeInfo.event.endStr
        }

        await updateEvent(updatedEvent)
    }

    // Modal management
    const closeEventModal = () => {
        isEventModalOpen.value = false
        selectedEvent.value = null
    }

    // Simple notification system - you might want to replace this with your preferred notification library
    const showNotification = (message, type = 'success') => {
        // Implementation depends on your notification system
        console.log(`${type}: ${message}`)
    }

    // Initialize calendar data
    onMounted(fetchEvents)

    // Return all necessary state and methods
    return {
        // State
        events,
        selectedEvent,
        isEventModalOpen,
        isLoading,
        error,
        calendarOptions,
        isLoggedIn,

        // Methods
        closeEventModal,
        refreshEvents: fetchEvents,
        updateEvent,
        deleteEvent
    }
}