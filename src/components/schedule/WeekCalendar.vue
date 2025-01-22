<template>
  <div class="week-calendar">
    <!-- Calendar Header -->
    <div class="grid grid-cols-7 bg-gray-50">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="p-2 text-center border-b font-medium"
      >
        <div class="text-sm md:text-base">{{ day.name }}</div>
        <div class="text-xs md:text-sm text-gray-600">{{ day.date }}</div>
      </div>
    </div>

    <!-- Calendar Body -->
    <div class="grid grid-cols-7">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        class="min-h-[120px] border-b border-r p-1 md:p-2"
      >
        <div class="space-y-1">
          <div 
            v-for="event in getEventsForDay(day.fullDate)" 
            :key="event.id"
            class="event p-1 md:p-2 rounded text-xs md:text-sm cursor-pointer hover:opacity-90"
            :style="getEventStyle(event)"
            @click="showEventDetails(event)"
          >
            <div class="font-medium">{{ event.subjectName }}</div>
            <div class="text-xs">
              {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div 
      v-if="selectedEvent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="selectedEvent = null"
    >
      <div 
        class="bg-white rounded-lg p-4 max-w-md w-full"
        @click.stop
      >
        <h3 class="text-lg font-medium mb-2">{{ selectedEvent.subjectName }}</h3>
        <p class="text-sm mb-2">
          {{ formatDateTime(selectedEvent.startTime) }} - {{ formatDateTime(selectedEvent.endTime) }}
        </p>
        <p class="text-sm text-gray-600">Group: {{ selectedEvent.group }}</p>
        <button 
          @click="selectedEvent = null"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { format, parseISO } from 'date-fns';

export default {
  name: 'WeekCalendar',
  
  props: {
    events: {
      type: Array,
      default: () => []
    },
    currentWeek: {
      type: Date,
      required: true
    }
  },

  setup(props) {
    const selectedEvent = ref(null);

    const weekDays = computed(() => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(props.currentWeek);
        date.setDate(date.getDate() + i);
        days.push({
          name: format(date, 'EEE'),
          date: format(date, 'dd/MM'),
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

    const getEventStyle = (event) => {
      // You can add more sophisticated color logic based on event type
      return {
        backgroundColor: '#E3F2FD',
        color: '#1E88E5'
      };
    };

    const showEventDetails = (event) => {
      selectedEvent.value = event;
    };

    return {
      weekDays,
      selectedEvent,
      getEventsForDay,
      formatTime,
      formatDateTime,
      getEventStyle,
      showEventDetails
    };
  }
};
</script>

<style scoped>
.event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .event {
    white-space: normal;
  }
}
</style>