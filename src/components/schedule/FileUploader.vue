<script setup>
import { ref, computed } from 'vue';
import { scheduleService } from '@/services/scheduleService';
import {usePermissions} from "@/composables/schedule/usePermission.js";

const emit = defineEmits(['error', 'upload-success']);
const fileInput = ref(null);
const selectedFile = ref(null);
const groupName = ref('');
const isUploading = ref(false);
const isDragging = ref(false);

const canUpload = computed(() => selectedFile.value && groupName.value.trim().length > 0);
const { isAdmin } = usePermissions();

const validateFile = (file) => {
  if (!file.name.endsWith('.ics')) {
    emit('error', 'Proszę wybrać plik ICS');
    return false;
  }
  return true;
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

const dragOver = () => isDragging.value = true;
const dragLeave = () => isDragging.value = false;

const handleUpload = async () => {
  if (!canUpload.value || isUploading.value) return;

  isUploading.value = true;
  try {
    await scheduleService.uploadSchedule(selectedFile.value, groupName.value.trim());
    resetForm();
    await new Promise(resolve => setTimeout(resolve, 1000));
    emit('upload-success');
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
</script>

<template>
  <div v-if="isAdmin" class="container mx-auto p-4">
    <div class="flex flex-col space-y-4">
      <div
          @dragover.prevent="dragOver"
          @dragleave.prevent="dragLeave"
          @drop.prevent="dropFile"
          class="flex flex-col space-y-4 p-6 border-2 border-dashed rounded-lg transition-colors duration-200"
          :class="[isDragging ? 'border-element' : 'border-gray-300 bg-white hover:border-elementHover']"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <input type="file" ref="fileInput" accept=".ics" @change="onFileChange" class="hidden" />
          <div class="flex flex-col items-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-gray-600">
              Przeciągnij i upuść plik ICS lub
              <span @click="$refs.fileInput.click()" class="text-textLink hover:underline cursor-pointer">
                wybierz plik
              </span>
            </p>
          </div>
        </div>

        <input
            v-model="groupName"
            type="text"
            class="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-appBg focus:border-transparent outline-none text-gray-700 placeholder-gray-400 bg-white"
            placeholder="Wprowadź nazwę grupy"
        />

        <div v-if="selectedFile" class="text-sm text-gray-600 px-1 text-center">
          Wybrany plik: {{ selectedFile.name }}
        </div>

        <button
            @click="handleUpload"
            :disabled="!canUpload || isUploading"
            class="px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            :class="[canUpload && !isUploading ? 'bg-addButton text-white hover:bg-addButtonHover' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
        >
          <svg v-if="isUploading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isUploading ? 'Przesyłanie...' : 'Prześlij' }}
        </button>
      </div>
    </div>
  </div>
</template>