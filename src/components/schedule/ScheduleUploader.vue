<template>
  <div class="schedule-uploader">
    <h2>Upload ICS File</h2>
    <form @submit.prevent="uploadFile">
      <input type="file" ref="fileInput" accept=".ics" @change="onFileChange" required />
      <button type="submit" :disabled="!file">Upload</button>
    </form>
    <p v-if="responseMessage" :class="{ success: isSuccess, error: !isSuccess }">{{ responseMessage }}</p>

    <div v-if="events.length > 0">
      <FullCalendar
        :events="events"
        :initialView="'dayGridMonth'"
        :header-toolbar="headerToolbar"
        :event-click="handleEventClick"
      />
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import axios from 'axios';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  name: 'ScheduleUploader',
  components: {
    FullCalendar
  },
  setup() {
    const file = ref(null);
    const responseMessage = ref('');
    const isSuccess = ref(false);
    const events = ref([]);

    const headerToolbar = {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    };

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!file.value) return;

      const formData = new FormData();
      formData.append('file', file.value);

      try {
        const response = await axios.post('/api/schedule/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle response
        if (response.data) {
          responseMessage.value = response.data;
          isSuccess.value = true;
          await fetchSchedule();
        }
      } catch (error) {
        responseMessage.value = error.response?.data || 'Error uploading file.';
        isSuccess.value = false;
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await axios.get('/api/schedule');
        console.log(response.data);
        
        events.value = response.data.map(event => ({
          title: event.subjectName,
          start: event.startTime,
          end: event.endTime
        }));
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    const handleEventClick = (info) => {
      alert('Event: ' + info.event.title);
    };

    onUnmounted(() => {
      // Cleanup if necessary
    });

    return {
      file,
      responseMessage,
      isSuccess,
      events,
      headerToolbar,
      onFileChange,
      uploadFile,
      handleEventClick
    };
  },
};
</script>

<style scoped>
.schedule-uploader {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.success {
  color: green;
}

.error {
  color: red;
}

button {
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
}
</style>
