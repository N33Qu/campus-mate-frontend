<template>
    <div class="calendar-container">
      <!-- Days header -->
      <div class="grid grid-cols-7 gap-4">
        <div 
          v-for="day in weekDays" 
          :key="day" 
          class="text-center font-medium p-2 bg-gray-100 rounded"
        >
          {{ day }}
        </div>
      </div>
  
      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-4 mt-2 min-h-[400px]">
        <div 
          v-for="(dayEvents, index) in weekEvents" 
          :key="index" 
          class="border rounded p-2 min-h-[100px]"
        >
          <div class="text-sm text-gray-500 mb-2">
            {{ getDayNumber(index) }}
          </div>
          <div 
            v-for="(event, eventIndex) in dayEvents" 
            :key="eventIndex" 
            class="text-xs p-1 mb-1 bg-blue-100 rounded"
          >
            <div class="font-medium">{{ event.subjectName }}</div>
            <div>
              {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WeekCalendar',
    props: {
      events: {
        type: Array,
        required: true
      },
      currentWeek: {
        type: Date,
        required: true
      }
    },
    data() {
      return {
        weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      };
    },
    computed: {
      weekEvents() {
        return this.groupEventsByDay(this.events);
      }
    },
    methods: {
      formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      },
      getDayNumber(index) {
        const date = new Date(this.currentWeek);
        date.setDate(date.getDate() + index);
        return date.getDate();
      },
      groupEventsByDay(events) {
        const days = Array(7).fill().map(() => []);
        events.forEach(event => {
          const eventDate = new Date(event.startTime);
          const dayIndex = (eventDate.getDay() + 6) % 7; // Converting Sunday = 0 to Monday = 0
          days[dayIndex].push(event);
        });
        return days;
      }
    }
  };
  </script>