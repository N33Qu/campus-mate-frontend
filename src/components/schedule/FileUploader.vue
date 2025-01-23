<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col space-y-4">
      <!-- Drag and Drop Uploader -->
      <div 
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @drop.prevent="dropFile"
        class="flex flex-col space-y-4 p-6 border-2 border-dashed rounded-lg transition-colors duration-200"
        :class="[
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-blue-500'
        ]"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <input 
            type="file" 
            ref="fileInput" 
            accept=".ics" 
            @change="onFileChange"
            class="hidden"
          />
          
          <div class="flex flex-col items-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            <p class="text-sm text-gray-600">
              Przeciągnij i upuść plik ICS lub 
              <span 
                @click="$refs.fileInput.click()" 
                class="text-blue-600 hover:underline cursor-pointer"
              >
                wybierz plik
              </span>
            </p>
          </div>
        </div>

        <input 
          v-model="groupName" 
          type="text" 
          class="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 bg-white"
          placeholder="Wprowadź nazwę grupy"
        />

        <!-- File name display -->
        <div v-if="selectedFile" class="text-sm text-gray-600 px-1 text-center">
          Wybrany plik: {{ selectedFile.name }}
        </div>

        <button 
          @click="handleUpload"
          :disabled="!canUpload || isUploading"
          class="px-4 py-2.5 rounded-lg font-medium min-w-[100px] whitespace-nowrap transition-colors duration-200"
          :class="[
            canUpload && !isUploading
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          <span class="flex items-center justify-center gap-2">
            <svg v-if="isUploading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isUploading ? 'Przesyłanie...' : 'Prześlij' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['error', 'upload-success']);
const fileInput = ref(null);
const selectedFile = ref(null);
const groupName = ref('');
const isUploading = ref(false);
const isDragging = ref(false);
const hasSchedules = ref(false);
const schedules = ref([]);

const canUpload = computed(() => {
  return selectedFile.value && groupName.value.trim().length > 0;
});

const validateFile = (file) => {
  if (!file.name.endsWith('.ics')) {
    emit('error', 'Proszę wybrać plik ICS');
    return false;
  }
  return true;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pl-PL', {
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
  } else {
    selectedFile.value = null;
    event.target.value = '';
  }
};

const dropFile = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
    fileInput.value.files = event.dataTransfer.files;
  }
};

const dragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const dragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
};

const fetchSchedules = async () => {
  try {
    const response = await fetch('/api/schedule');
    schedules.value = await response.json();
    hasSchedules.value = schedules.value.length > 0;
  } catch (err) {
    console.error('Error fetching schedules', err);
    hasSchedules.value = false;
    emit('error', 'Nie udało się pobrać harmonogramów');
  }
};

const handleUpload = async () => {
  if (!canUpload.value || isUploading.value) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('groupName', groupName.value.trim());

  try {
    const response = await fetch('/api/schedule/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas przesyłania planu');
    }

    // Fetch updated schedules
    await fetchSchedules();

    emit('upload-success');
    resetForm();
  } catch (err) {
    emit('error', 'Przesyłanie planu nie powiodło się');
  } finally {
    isUploading.value = false;
  }
};

const resetForm = () => {
  selectedFile.value = null;
  groupName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Fetch schedules on component mount
onMounted(fetchSchedules);
</script>