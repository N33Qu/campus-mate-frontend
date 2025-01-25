import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { calendarService } from '@/services/calendarService.js'
import pl from "@fullcalendar/core/locales/pl";
import {useShowNotification} from "@/composables/useShowNotification.js";
import { usePermissions } from './useEventPermissions'

export function useCalendar() {
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => authStore.isTokenValid)
    const userId = computed(() => authStore.userId)
    const events = ref([])
    const selectedEvent = ref(null)
    const isEventModalOpen = ref(false)
    const isLoading = ref(false)
    const error = ref(null)
    const modalMode = ref('view')
    const {showNotification} = useShowNotification()
    const { canEdit, validateEdit, validateView } = usePermissions()

    const calendarOptions = computed(() => ({
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: handleEventClick,
        events: events.value,
        height: 'auto',
        editable: canEdit.value,
        selectable: canEdit.value,
        eventColor: '#888580',
        locale: pl,
        select: canEdit.value ? handleDateSelect : null,
        eventDrop: canEdit.value ? handleEventDrop : null,
        eventResize: canEdit.value ? handleEventResize : null
    }))

    const createEvent = async (eventData) => {
        try {
            validateEdit()
            isLoading.value = true
            error.value = null
            console.log(eventData)
            await calendarService.createEvent(eventData)
            await fetchEvents()
            showNotification('Wydarzenie utworzone pomyślnie')
        } catch (err) {
            error.value = err.message || 'Błąd tworzenia wydarzenia'
            console.error('Error creating event:', err)
            showNotification(error.value, 'error')
        } finally {
            isLoading.value = false
        }
    }

    const fetchEvents = async () => {
        if (!userId.value) {
            error.value = 'Użytkownik nie jest zalogowany'
            console.error('User is not logged in')
            showNotification(error.value, 'error')
            return
        }
        isLoading.value = true
        error.value = null
        try {
            events.value = await calendarService.getEvents(userId.value)
        } catch (err) {
            error.value = 'Błąd pobierania wydarzeń'
            console.error('Error fetching events:', err)
            showNotification(error.value, 'error')
        } finally {
            isLoading.value = false
        }
    }

    const handleDateSelect = (selectInfo) => {
        selectedEvent.value = {
            startDate: selectInfo.start,
            endDate: selectInfo.end
        }
        modalMode.value = 'create'
        isEventModalOpen.value = true
    }

    const handleEventClick = (clickInfo) => {
        try {
            validateView()
            selectedEvent.value = {
                eventId: clickInfo.event.extendedProps.eventId,
                eventName: clickInfo.event.title,
                eventDescription: clickInfo.event.extendedProps.description || 'Brak opisu',
                startDate: clickInfo.event.start,
                endDate: clickInfo.event.end,
            }
            isEventModalOpen.value = true
        } catch (err) {
            showNotification(err.message, 'error')
        }
    }

    const updateEvent = async (updatedEvent) => {
        try {
            validateEdit()
            isLoading.value = true
            error.value = null

            await calendarService.updateEvent(updatedEvent.eventId, updatedEvent)
            events.value = events.value.map(event =>
                event.eventId === updatedEvent.eventId ? updatedEvent : event
            )
            showNotification('Wydarzenie zaktualizowane pomyślnie')
        } catch (err) {
            error.value = err.message || 'Błąd aktualizacji wydarzenia'
            console.error('Error updating event:', err)
            showNotification(error.value, 'error')
        } finally {
            isLoading.value = false
        }
    }

    const deleteEvent = async (eventId) => {
        try {
            validateEdit()
            isLoading.value = true
            error.value = null

            await calendarService.deleteEvent(eventId)
            events.value = events.value.filter(event => event.eventId !== eventId)
            showNotification('Wydarzenie usunięte pomyślnie')
        } catch (err) {
            error.value = err.message || 'Błąd usuwania wydarzenia'
            console.error('Error deleting event:', err)
            showNotification(error.value, 'error')
        } finally {
            isLoading.value = false
        }
    }

    const handleEventDrop = async (dropInfo) => {
        const updatedEvent = {
            eventId: dropInfo.event.extendedProps.eventId,
            eventName: dropInfo.event.title,
            eventDescription: dropInfo.event.extendedProps.description,
            startDate: dropInfo.event.start,
            endDate: dropInfo.event.end
        }

        await updateEvent(updatedEvent)
    }

    const handleEventResize = async (resizeInfo) => {
        const updatedEvent = {
            eventId: resizeInfo.event.extendedProps.eventId,
            eventName: resizeInfo.event.title,
            eventDescription: resizeInfo.event.extendedProps.description,
            startDate: resizeInfo.event.start,
            endDate: resizeInfo.event.end,
        }

        await updateEvent(updatedEvent)
    }

    const closeEventModal = () => {
        isEventModalOpen.value = false
        selectedEvent.value = null
    }


    onMounted(fetchEvents)

    return {
        events,
        selectedEvent,
        isEventModalOpen,
        isLoading,
        error,
        calendarOptions,
        isLoggedIn,
        modalMode,
        createEvent,
        closeEventModal,
        refreshEvents: fetchEvents,
        updateEvent,
        deleteEvent
    }
}