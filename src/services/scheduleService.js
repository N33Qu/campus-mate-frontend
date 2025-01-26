import api from '@/config/axiosConfig';

export const scheduleService = {
    async fetchSchedules() {
        const response = await api.get('/schedule');
        return response.data;
    },

    async fetchGroups() {
        const response = await api.get('/schedule');
        const schedules = response.data;
        return [...new Set(schedules.map(schedule => schedule.group))];
    },

    async deleteSchedule(groupName) {
        const response = await api.delete(`/schedule/${groupName}`);
        return response.data;
    },

    async uploadSchedule(file, groupName) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('groupName', groupName);

        const response = await api.post('/schedule/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};