import api from '@/config/axiosConfig';
import { usePermissions } from '@/composables/usePermissions';

export const scheduleService = {
    async fetchSchedules() {
        const response = await api.get('/schedule');
        return response.data;
    },

    async uploadSchedule(file, groupName) {
        const { isAdmin } = usePermissions();
        if (!isAdmin.value) {
            throw new Error('Unauthorized: Admin access required');
        }

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