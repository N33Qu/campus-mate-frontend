import api from '@/config/axiosConfig.js'

export const calendarService = {

    async createEvent(eventData) {
        try {
            const response = await api.post('/event', {
                eventName: eventData.eventName,
                startDate: new Date(eventData.startDate).toISOString(),
                endDate: new Date(eventData.endDate).toISOString(),
                eventDescription: eventData.eventDescription,
                teamId: eventData.teamId
            })
            location.reload()
            return response.data
        } catch (error) {
            console.error('Error creating event:', error)
            throw error
        }
    },

    async getEvents(userId) {
        try {
            const response = await api.get(`/user/events/${userId}`)
            console.log(response.data)
            return response.data.map(event => ({
                id: event.eventId,
                title: event.eventName,
                start: event.startDate,
                end: event.endDate,
                extendedProps: {
                    description: event.eventDescription,
                    eventId: event.eventId
                }
            }))
        } catch (error) {
            console.error('Error fetching events:', error)
            throw error
        }
    },

    async updateEvent(eventId, eventData) {
        try {
            const response = await api.patch(`/event/${eventId}`, {
                eventName: eventData.eventName,
                startDate: new Date(eventData.startDate).toISOString(),
                endDate: new Date(eventData.endDate).toISOString(),
                eventDescription: eventData.eventDescription
            })
            location.reload()
            return response.data
        } catch (error) {
            console.error('Error updating event:', error)
            throw error
        }
    },

    async deleteEvent(eventId) {
        try {
            const response = await api.delete(`/event/${eventId}`)
            location.reload()
            return response.data
        } catch (error) {
            console.error('Error deleting event:', error)
            throw error
        }
    }
}