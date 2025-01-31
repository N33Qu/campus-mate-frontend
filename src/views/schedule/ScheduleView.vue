<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from 'vue';
import {useSchedule} from '@/composables/schedule/useSchedule';
import {useDate} from '@/composables/schedule/useDate';
import {usePermissions} from '@/composables/schedule/usePermission';
import FileUploader from '@/components/schedule/FileUploader.vue';
import GroupList from '@/components/schedule/GroupList.vue';
import ErrorDisplay from '@/components/schedule/ErrorDisplay.vue';
import WeekNavigation from '@/components/schedule/WeekNavigation.vue';
import WeekCalendar from '@/components/schedule/WeekCalendar.vue';
import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore();

const {isAdmin} = usePermissions();
const {currentWeek, events, error, fetchSchedule, filteredEvents, previousWeek, nextWeek} = useSchedule();
const {getEndOfWeek} = useDate();

const selectedGroup = ref(null);
const showGroups = ref(false);

const hasNoPlans = computed(() => events.value.length === 0);
const filteredEventsData = computed(() => filteredEvents(selectedGroup.value).value);

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
  if (!isAdmin.value) return;
  await initializeGroup()
  location.reload();
};

const handleError = (msg) => {
  error.value = msg;
};

const handleGroupDeleted = async (group) => {
  if (selectedGroup.value === group) {
    selectedGroup.value = null;
  }
  await fetchSchedule();
  location.reload();
};

const initializeGroup = async () => {
  await fetchSchedule();

  if (events.value.length > 0) {
    const uniqueGroups = [...new Set(events.value.map(event => event.group))];

    if (authStore.getGroup && uniqueGroups.includes(authStore.getGroup)) {
      selectedGroup.value = authStore.getGroup;
    } else {
      selectedGroup.value = uniqueGroups[0];
    }
  }
};

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    showGroups.value = true;
  }
};

onMounted(() => {
  initializeGroup();
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(events.value, async () => {
  await fetchSchedule();
}, { deep: true })

</script>

<template>
  <div class="max-w-[1200px] mx-auto p-5 md:p-4" >
    <div class="grid lg:grid-cols-4 md:grid-cols-1 gap-4">
      <div class="lg:col-span-1 md:col-span-1">
        <div class="bg-elementLight rounded-lg shadow-sm">
          <FileUploader
              v-if="isAdmin"
              @error="handleError"
              @upload-success="handleUploadSuccess"
          />
          <div class="p-4">
            <div class="flex lg:hidden mb-4">
              <button
                  @click="toggleGroups"
                  class="px-4 py-2 bg-button text-white rounded hover:bg-buttonHover"
              >
                {{ showGroups ? 'Schowaj grupy' : 'Pokaż grupy' }}
              </button>
            </div>
            <div :class="{'hidden': !showGroups}">
              <GroupList
                  :selected-group="selectedGroup"
                  @group-selected="handleGroupSelect"
                  @group-deleted="handleGroupDeleted"
                  @error="handleError"
                  ref="groupList"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="lg:col-span-3 md:col-span-1">
        <div class="bg-elementLight rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h2 class="text-xl font-semibold flex items-center gap-2">
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

          <div class="p-4 overflow-x-auto">
            <ErrorDisplay :message="error"/>
            <div v-if="hasNoPlans" class="text-center py-8">
              <div class="flex justify-center items-center">
                <div class="text-center">
                  <i class="pi pi-calendar-times text-4xl text-gray-400 mb-4"></i>
                  <h2 class="text-xl font-medium text-gray-700">Brak dostępnych planów</h2>
                  <p class="text-gray-500">
                    <template v-if="isAdmin">
                      Wczytaj plik ICS, aby wyświetlić plan.
                    </template>
                    <template v-else>
                      Skontaktuj się z administratorem, aby dodać plan zajęć.
                    </template>
                  </p>
                </div>
              </div>
            </div>
            <WeekCalendar
                v-else
                :events="filteredEventsData"
                :current-week="currentWeek"
                class="min-w-[800px] xl:min-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

