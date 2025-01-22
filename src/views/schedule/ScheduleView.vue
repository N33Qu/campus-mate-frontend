   <!-- <!-- <template>
     <div class="schedule-container">
       <div class="card">
         <div class="card-header flex justify-between items-center">
           <h2 class="card-title flex items-center gap-2">
             <i class="calendar-icon"></i>
             Schedule Viewer
           </h2>
           <FileUploader @file-change="handleFileUpload" />
         </div>
   
         <div class="card-content">
           <ErrorDisplay :message="error" />
           
           <WeekNavigation 
             :start-date="currentWeek"
             :end-date="getEndOfWeek(currentWeek)"
             @previous-week="previousWeek"
             @next-week="nextWeek"
           />
   
           <WeekCalendar 
             :events="events"
             :current-week="currentWeek"
           />
         </div>
       </div>
     </div>
   </template> -->
   <!-- <template>
    <div class="schedule-container">
      <div class="grid grid-cols-4 gap-4">
         Group List Sidebar -->
        <!-- <div class="col-span-1">
          <div class="card">
            <div class="card-header">
              <FileUploader 
                @error="error = $event"
                @upload-success="handleUploadSuccess"
              />
            </div>
            <div class="card-content">
              <GroupList 
                :selected-group="selectedGroup"
                @group-selected="handleGroupSelect"
                @error="error = $event"
              />
            </div>
          </div>
        </div>
  
        < Calendar Section -->
        <!-- <div class="col-span-3">
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <h2 class="card-title flex items-center gap-2">
                <i class="calendar-icon"></i>
                Schedule Viewer
                <span v-if="selectedGroup" class="text-sm text-gray-600">
                  ({{ selectedGroup }})
                </span>
              </h2>
            </div>
  
            <div class="card-content">
              <ErrorDisplay :message="error" />
              
              <WeekNavigation 
                :start-date="currentWeek"
                :end-date="getEndOfWeek(currentWeek)"
                @previous-week="previousWeek"
                @next-week="nextWeek"
              />
  
              <WeekCalendar 
                :events="filteredEvents"
                :current-week="currentWeek"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template> -->
<!--    
   <script>
   import { ref, onMounted } from 'vue';
   import FileUploader from '@/components/schedule/FileUploader.vue';
   import ErrorDisplay from '@/components/schedule/ErrorDisplay.vue';
   import WeekNavigation from '@/components/schedule/WeekNavigation.vue';
   import WeekCalendar from '@/components/schedule/WeekCalendar.vue';  -->
<!--    
   // Utility functions declared outside of setup
//    const getStartOfWeek = (date) => {
//      const newDate = new Date(date);
//      const day = newDate.getDay();
//      const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
//      newDate.setDate(diff);
//      newDate.setHours(0, 0, 0, 0);
//      return newDate;
//    };
   
//    const getEndOfWeek = (date) => {
//      const endDate = new Date(date);
//      endDate.setDate(endDate.getDate() + 6);
//      endDate.setHours(23, 59, 59, 999);
//      return endDate;
//    };
   
//    export default {
//      name: 'ScheduleView',
//      components: {
//        FileUploader,
//        ErrorDisplay,
//        WeekNavigation,
//        WeekCalendar
//      },
//      setup() {
//        // State
//        const currentWeek = ref(getStartOfWeek(new Date()));
//        const events = ref([]);
//        const error = ref('');
//        const loading = ref(false);
   
//        // Methods
//        const fetchSchedule = async () => {
//          try {
//            loading.value = true;
//            const response = await fetch('/api/schedule', {
//              credentials: 'include'
//            });
           
//            if (!response.ok) {
//              throw new Error('Failed to fetch schedule');
//            }
   
//            const data = await response.json();
//            const filteredEvents = data.filter(event => {
//              const eventStart = new Date(event.startTime);
//              const eventEnd = new Date(event.endTime);
//              return eventStart >= currentWeek.value && 
//                     eventEnd <= getEndOfWeek(currentWeek.value);
//            });
   
//            events.value = filteredEvents;
//          } catch (err) {
//            error.value = 'Failed to load schedule. Please try again later.';
//          } finally {
//            loading.value = false;
//          }
//        };
   
//        const handleFileUpload = async ({ file, groupName }) => {
//       if (!file || !file.name.endsWith('.ics')) {
//         error.value = 'Please select a valid ICS file';
//         return;
//       }

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('groupName', groupName);

//       try {
//         loading.value = true;
//         const response = await fetch('/api/schedule/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (!response.ok) {
//           throw new Error('Upload failed');
//         }

//         await fetchGroups(); // Odśwież listę grup po dodaniu nowej
//         await fetchSchedule();
//         error.value = '';
//       } catch (err) {
//         error.value = 'Failed to upload schedule. Please try again.';
//       } finally {
//         loading.value = false;
//       }
//     };
//        const previousWeek = () => {
//          const newDate = new Date(currentWeek.value);
//          newDate.setDate(newDate.getDate() - 7);
//          currentWeek.value = getStartOfWeek(newDate);
//        };
   
//        const nextWeek = () => {
//          const newDate = new Date(currentWeek.value);
//          newDate.setDate(newDate.getDate() + 7);
//          currentWeek.value = getStartOfWeek(newDate);
//        };
   
//        // Lifecycle hooks
//        onMounted(() => {
//          fetchSchedule();
//        });
   
//        // Expose to template
//        return {
//          currentWeek,
//          events,
//          error,
//          loading,
//          handleFileUpload,
//          previousWeek,
//          nextWeek,
//          getEndOfWeek
//        };
//      }
//    };
//    </script>
   
//    <style scoped>
//    .schedule-container {
//      max-width: 1200px;
//      margin: 0 auto;
//      padding: 20px;
//    }
   
//    .card {
//      background: white;
//      border-radius: 8px;
//      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//    }
   
//    .card-header {
//      padding: 1rem;
//      border-bottom: 1px solid #eee;
//    }
   
//    .card-content {
//      padding: 1rem;
//    }
//    </style> -->

<template>
    <div class="schedule-container">
      <div class="grid grid-cols-4 gap-4">
        <!-- Group List Sidebar -->
        <div class="col-span-1">
          <div class="card">
            <div class="card-header">
              <FileUploader 
                @error="error = $event"
                @upload="handleUpload"
              />
            </div>
          </div>
        </div>
  
        <!-- Calendar Section -->
        <div class="col-span-3">
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <h2 class="card-title flex items-center gap-2">
                <i class="calendar-icon"></i>
                Schedule Viewer
              </h2>
            </div>
  
            <div class="card-content">
              <ErrorDisplay :message="error" />
              
              <WeekNavigation 
                :start-date="currentWeek"
                :end-date="getEndOfWeek(currentWeek)"
                @previous-week="previousWeek"
                @next-week="nextWeek"
              />
  
              <WeekCalendar 
                :events="events"
                :current-week="currentWeek"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import FileUploader from '@/components/schedule/FileUploader.vue';
  import ErrorDisplay from '@/components/schedule/ErrorDisplay.vue';
  import WeekNavigation from '@/components/schedule/WeekNavigation.vue';
  import WeekCalendar from '@/components/schedule/WeekCalendar.vue';
  
  // Utility functions
  const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
    newDate.setDate(diff);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  const getEndOfWeek = (date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };
  
  export default {
    name: 'ScheduleView',
    components: {
      FileUploader,
      ErrorDisplay,
      WeekNavigation,
      WeekCalendar
    },
    setup() {
      const currentWeek = ref(getStartOfWeek(new Date()));
      const events = ref([]);
      const error = ref('');
      const loading = ref(false);
      const selectedGroup = ref(null);
  
      const fetchSchedule = async () => {
        try {
          loading.value = true;
          const response = await fetch('/api/schedule', {
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch schedule');
          }
  
          const data = await response.json();
          const filteredEvents = data.filter(event => {
            const eventStart = new Date(event.startTime);
            const eventEnd = new Date(event.endTime);
            return eventStart >= currentWeek.value && 
                   eventEnd <= getEndOfWeek(currentWeek.value);
          });
  
          events.value = filteredEvents;
        } catch (err) {
          error.value = 'Failed to load schedule. Please try again later.';
        } finally {
          loading.value = false;
        }
      };
  
      const handleUpload = async (uploadData) => {
        try {
          const formData = new FormData();
          formData.append('file', uploadData.file);
          formData.append('groupName', uploadData.groupName);
  
          const response = await fetch('/api/schedule/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Upload failed');
          }
  
          await fetchSchedule();
          error.value = '';
        } catch (err) {
          error.value = 'Failed to upload schedule. Please try again.';
        }
      };
  
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
  
      // Filter events based on selected group
      const filteredEvents = computed(() => {
        if (!selectedGroup.value || !events.value) return events.value;
        return events.value.filter(event => event.group === selectedGroup.value);
      });
  
      // Fetch initial data
      fetchSchedule();
  
      return {
        currentWeek,
        events,
        error,
        loading,
        selectedGroup,
        handleUpload,
        previousWeek,
        nextWeek,
        getEndOfWeek,
        filteredEvents
      };
    }
  };
  </script>
  
  <style scoped>
  .schedule-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .card-header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .card-content {
    padding: 1rem;
  }
  </style>