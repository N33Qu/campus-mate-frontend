import { ref, computed, onMounted } from 'vue'
import api from '@/axios.js'
import { useAuthStore } from '@/stores/authStore'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export function useCalendar() {
    const authStore = useAuthStore()
    const calendar = ref(null)
    const selectedEvent = ref(null)
    const isEventModalOpen = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    const fetchCalendar = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get(`/calendars/user/${authStore.userId}`)
            calendar.value = response.data
        } catch (err) {
            error.value = 'Failed to fetch calendar'
            console.error('Error fetching calendar:', err)
        } finally {
            isLoading.value = false
        }
    }

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

    const calendarOptions = computed(() => ({
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: handleEventClick,
        events: fetchEvents
    }))

    const handleEventClick = (clickInfo) => {
        selectedEvent.value = {
            title: clickInfo.event.title,
            description: clickInfo.event.extendedProps.description || 'No description',
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr
        }
        isEventModalOpen.value = true
    }

    const closeEventModal = () => {
        isEventModalOpen.value = false
        selectedEvent.value = null
    }

    onMounted(fetchCalendar)

    return {
        calendar,
        selectedEvent,
        isEventModalOpen,
        isLoading,
        error,
        calendarOptions,
        closeEventModal
    }
}