<template>
  <div class="flex flex-col space-y-4 p-6">
    <div class="flex flex-wrap items-center gap-3">
      <input 
        v-model="groupName" 
        type="text" 
        class="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400 bg-white"
        placeholder="Enter group name"
      />
      
      <input 
        type="file" 
        ref="fileInput" 
        accept=".ics" 
        @change="onFileChange"
        class="hidden"
      />

      <button 
        @click="$refs.fileInput.click()"
        class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap font-medium min-w-[120px]"
      >
        Wybierz plik
      </button>

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
        <span class="flex items-center gap-2">
          <svg v-if="isUploading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ isUploading ? 'Przesyłanie...' : 'Prześlij' }}
        </span>
      </button>
    </div>

    <!-- File name display -->
    <div v-if="selectedFile" class="text-sm text-gray-600 px-1">
      Selected file: {{ selectedFile.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['error', 'upload-success']);
const fileInput = ref(null);
const selectedFile = ref(null);
const groupName = ref('');
const isUploading = ref(false);

const canUpload = computed(() => {
  return selectedFile.value && groupName.value.trim().length > 0;
});

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && !file.name.endsWith('.ics')) {
    emit('error', 'Proszę wybrać plik ICS');
    selectedFile.value = null;
    event.target.value = '';
    return;
  }
  selectedFile.value = file;
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
</script>