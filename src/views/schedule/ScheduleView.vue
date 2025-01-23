<template>
  <div class="schedule-container">
    <div class="grid lg:grid-cols-4 md:grid-cols-1 gap-4">
      <!-- Group List Sidebar - Collapsible on mobile -->
      <div class="lg:col-span-1 md:col-span-1">
        <div class="card">
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
                {{ showGroups ? 'Schowaj grupy' : 'Poka grupy' }}
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

      <!-- Calendar Section -->
      <div class="lg:col-span-3 md:col-span-1">
        <div class="card">
          <div class="card-header">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <i class="calendar-icon"></i>
                Plan zajęć
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
            <div v-if="hasNoPlans" class="text-center py-8">
              <artifact identifier="no-plan-view" type="text/html" title="No Plans Available View">
                <div class="flex justify-center items-center h-full">
                  <div class="text-center">
                    <i class="fa fa-calendar-times-o text-4xl text-gray-400 mb-4"></i>
                    <h2 class="text-xl font-medium text-gray-700">Brak dostępnych planów</h2>
                    <p class="text-gray-500">Wczytaj plik ICS, aby wyświetlić plan.</p>
                  </div>
                </div>
                </artifact>
            </div>
            <WeekCalendar 
              v-else
              :events="filteredEvents"
              :current-week="currentWeek"
              class="min-w-[800px]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

const currentWeek = ref(getStartOfWeek(new Date()));
const events = ref([]);
const error = ref('');
const loading = ref(false);
const selectedGroup = ref(null);
const showGroups = ref(false);
const groupListRef = ref(null);

const fetchSchedule = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/schedule', {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    events.value = await response.json();
  } catch (err) {
    error.value = 'Wystąpił błąd podczas pobierania planu. Spróbuj ponownie później.';
  } finally {
    loading.value = false;
  }
};

const hasNoPlans = computed(() => events.value.length === 0);

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

const toggleGroups = () => {
  showGroups.value = !showGroups.value;
};

const handleGroupSelect = (group) => {
  selectedGroup.value = group;
  if (window.innerWidth < 1024) {
    showGroups.value = false;
  }
};

const handleUploadSuccess = async () => {
  await fetchSchedule();
  if (groupListRef.value) {
    await groupListRef.value.refresh();
  }
};

const handleError = (msg) => {
  error.value = msg;
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

onMounted(() => {
  fetchSchedule();
});
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