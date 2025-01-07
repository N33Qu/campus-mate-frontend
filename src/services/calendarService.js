import api from '@/config/axiosConfig.js'

export const calendarService = {
    async getEvents(userId) {
        try {
            const response = await api.get(`/user/events/${userId}`)
            return response.data.map(event => ({
                eventId: event.eventId,
                title: event.eventName,
                start: event.startDate,
                end: event.endDate,
                description: event.description
            }))
        } catch (error) {
            console.error('Error fetching events:', error)
            throw error
        }
    },

    async updateEvent(eventId, eventData) {
        try {
            const response = await api.put(`/event/${eventId}`, {
                eventName: eventData.title,
                startDate: eventData.start,
                endDate: eventData.end,
                description: eventData.description
            })
            return response.data
        } catch (error) {
            console.error('Error updating event:', error)
            throw error
        }
    },

    async deleteEvent(eventId) {
        try {
            const response = await api.delete(`/event/${eventId}`)
            return response.data
        } catch (error) {
            console.error('Error deleting event:', error)
            throw error
        }
    }
}