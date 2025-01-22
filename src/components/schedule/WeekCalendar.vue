<template>
  <div class="week-calendar bg-white rounded-lg shadow">
    <!-- Calendar Header -->
    <div class="grid grid-cols-7 bg-gray-50 rounded-t-lg">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="p-2 text-center border-b border-gray-200"
      >
        <div class="text-sm md:text-base font-semibold text-gray-800">{{ day.name }}</div>
        <div class="text-xs md:text-sm text-gray-600">{{ day.date }}</div>
      </div>
    </div>

    <!-- Calendar Body -->
    <div class="grid grid-cols-7">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="min-h-[120px] border-b border-r border-gray-200 p-1 md:p-2"
      >
        <div class="space-y-1">
          <div 
            v-for="event in getEventsForDay(day.fullDate)" 
            :key="event.id"
            class="rounded-lg p-1 md:p-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
            :class="getEventClasses(event)"
            @click="showEventDetails(event)"
          >
            <div class="font-medium truncate">{{ event.subjectName }}</div>
            <div class="text-xs opacity-75">
              {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div 
      v-if="selectedEvent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ selectedEvent.subjectName }}</h3>
        <p class="text-sm mb-2 text-gray-700">
          {{ formatDateTime(selectedEvent.startTime) }} - {{ formatDateTime(selectedEvent.endTime) }}
        </p>
        <p class="text-sm text-gray-600">Grupy: {{ selectedEvent.group }}</p>
        <button 
          @click="closeModal"
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Zamknij
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  currentWeek: {
    type: Date,
    required: true
  }
});

const selectedEvent = ref(null);

const weekDays = computed(() => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(props.currentWeek);
    date.setDate(date.getDate() + i);
    days.push({
      name: format(date, 'EEE', {locale: pl}),
      date: format(date, 'dd/MM', {locale: pl}),
      fullDate: date
    });
  }
  return days;
});

const getEventsForDay = (date) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate.toDateString() === date.toDateString();
  });
};

const formatTime = (dateString) => {
  return format(parseISO(dateString), 'HH:mm');
};

const formatDateTime = (dateString) => {
  return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
};

const getEventClasses = (event) => {
  return 'bg-blue-100 text-blue-800';
};

const showEventDetails = (event) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};
</script>