import api from '@/config/axiosConfig';

export const addressBookService = {
    async getAllEntries() {
        const response = await api.get('/addressBook/entries/all');
        return response.data;
    },

    async searchEntries(query) {
        const response = await api.get(`/addressBook/entries/search/${query}`);
        return response.data;
    },

    async deleteEntry(id) {
        await api.delete(`/addressBook/entries/${id}`);
    },

    async updateEntry(entryId, data) {
        const response = await api.patch(`/addressBook/entries/${entryId}`, data);
        return response.data;
    }
};