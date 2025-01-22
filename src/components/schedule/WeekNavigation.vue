<template>
    <div class="flex justify-between items-center mb-4">
      <button @click="$emit('previous-week')" class="btn btn-outline">&larr; Poprzedni tydzień</button>
      <span class="font-medium">
        {{ formatDateRange(startDate, endDate) }}
      </span>
      <button @click="$emit('next-week')" class="btn btn-outline">Następny tydzień &rarr;</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WeekNavigation',
    props: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    },
    methods: {
      formatDateRange(start, end) {
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
      }
    }
  };
  </script>