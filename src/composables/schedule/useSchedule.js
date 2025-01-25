import { ref, computed } from 'vue';
import { scheduleService } from '@/services/scheduleService';
import { useDate } from '@/composables/schedule/useDate';

export const useSchedule = () => {
    const { getStartOfWeek, getEndOfWeek } = useDate();
    const currentWeek = ref(getStartOfWeek(new Date()));
    const events = ref([]);
    const error = ref('');
    const loading = ref(false);

    const fetchSchedule = async () => {
        try {
            loading.value = true;
            events.value = await scheduleService.fetchSchedules();
        } catch (err) {
            error.value = 'Wystąpił błąd podczas pobierania planu. Spróbuj ponownie później.';
        } finally {
            loading.value = false;
        }
    };

    const filteredEvents = (selectedGroup) => computed(() => {
        if (!selectedGroup) return events.value;
        return events.value.filter(event => {
            const eventStart = new Date(event.startTime);
            const eventEnd = new Date(event.endTime);
            return event.group === selectedGroup &&
                eventStart >= currentWeek.value &&
                eventEnd <= getEndOfWeek(currentWeek.value);
        });
    });

    const previousWeek = () => {
        const newDate = new Date(currentWeek.value);
        newDate.setDate(newDate.getDate() - 7);
        currentWeek.value = getStartOfWeek(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(currentWeek.value);
        newDate.setDate(newDate.getDate() + 7);
        currentWeek.value = getStartOfWeek(newDate);
    };

    return {
        currentWeek,
        events,
        error,
        loading,
        fetchSchedule,
        filteredEvents,
        previousWeek,
        nextWeek
    };
};