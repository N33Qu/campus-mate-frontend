<template>
  <div class="schedule-container">
    <div class="grid lg:grid-cols-5 md:grid-cols-1 gap-6">
      <!-- Group List Sidebar - Made wider -->
      <div class="lg:col-span-1 md:col-span-1">
        <div class="card h-full">
          <div class="card-header">
            <FileUploader 
              @error="handleError"
              @upload-success="handleUploadSuccess"
            />
          </div>
          <div class="card-content">
            <div class="flex lg:hidden mb-4">
              <button 
                @click="toggleGroups"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {{ showGroups ? 'Hide Groups' : 'Show Groups' }}
              </button>
            </div>
            <div :class="{'hidden md:block lg:block': !showGroups}">
              <GroupList 
                :selected-group="selectedGroup"
                @group-selected="handleGroupSelect"
                @error="handleError"
                ref="groupList"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Section - Made wider -->
      <div class="lg:col-span-4 md:col-span-1">
        <div class="card">
          <div class="card-header">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <i class="calendar-icon"></i>
                Schedule Viewer
                <span v-if="selectedGroup" class="text-sm text-gray-600">
                  ({{ selectedGroup }})
                </span>
              </h2>
              
              <WeekNavigation 
                :start-date="currentWeek"
                :end-date="getEndOfWeek(currentWeek)"
                @previous-week="previousWeek"
                @next-week="nextWeek"
                class="w-full md:w-auto"
              />
            </div>
          </div>

          <div class="card-content overflow-x-auto">
            <ErrorDisplay :message="error" />
            <WeekCalendar 
              :events="filteredEvents"
              :current-week="currentWeek"
              class="min-w-[1000px]"
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
import GroupList from '@/components/schedule/GroupList.vue';
import ErrorDisplay from '@/components/schedule/ErrorDisplay.vue';
import WeekNavigation from '@/components/schedule/WeekNavigation.vue';
import WeekCalendar from '@/components/schedule/WeekCalendar.vue';

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
    GroupList,
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
    const showGroups = ref(false);

    const toggleGroups = () => {
      showGroups.value = !showGroups.value;
    };

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
        events.value = data;
      } catch (err) {
        error.value = 'Failed to load schedule. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    const filteredEvents = computed(() => {
      if (!selectedGroup.value) return events.value;
      return events.value.filter(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        return event.group === selectedGroup.value &&
               eventStart >= currentWeek.value && 
               eventEnd <= getEndOfWeek(currentWeek.value);
      });
    });

    const handleGroupSelect = (group) => {
      selectedGroup.value = group;
      // Hide groups list on mobile after selection
      if (window.innerWidth < 1024) {
        showGroups.value = false;
      }
    };

    const handleUploadSuccess = async () => {
      await fetchSchedule();
      if (this.$refs.groupList?.refresh) {
        await this.$refs.groupList.refresh();
      }
    };

    // Fetch initial data
    fetchSchedule();

    return {
      currentWeek,
      events,
      error,
      loading,
      selectedGroup,
      showGroups,
      toggleGroups,
      handleGroupSelect,
      handleUploadSuccess,
      handleError: (msg) => error.value = msg,
      previousWeek: () => {
        const newDate = new Date(currentWeek.value);
        newDate.setDate(newDate.getDate() - 7);
        currentWeek.value = getStartOfWeek(newDate);
      },
      nextWeek: () => {
        const newDate = new Date(currentWeek.value);
        newDate.setDate(newDate.getDate() + 7);
        currentWeek.value = getStartOfWeek(newDate);
      },
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

@media (max-width: 768px) {
  .schedule-container {
    padding: 10px;
  }
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

@media (max-width: 640px) {
  .card-header,
  .card-content {
    padding: 0.75rem;
  }
}
</style>