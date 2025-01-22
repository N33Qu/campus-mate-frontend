<template>
    <div class="upload-container">
      <div class="flex gap-4 items-end">
        <!-- Group Name Input -->
        <div class="flex flex-col gap-2">
          <label for="group-name" class="text-sm font-medium">Group Name</label>
          <input 
            id="group-name"
            v-model="groupName" 
            type="text" 
            class="px-3 py-2 border rounded"
            placeholder="Enter group name"
          />
        </div>
  
        <!-- File Input -->
        <div class="flex flex-col gap-2">
          <label for="schedule-upload" class="text-sm font-medium">Schedule File</label>
          <input 
            type="file" 
            ref="fileInput" 
            id="schedule-upload"
            accept=".ics" 
            @change="onFileChange"
            class="hidden"
          />
          <label 
            for="schedule-upload" 
            class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 inline-block transition-colors duration-200"
          >
            Select ICS File
          </label>
        </div>
  
        <!-- Upload Button -->
        <UploadButton 
          :is-loading="isLoading"
          :disabled="!canUpload"
          @click="handleUpload"
        />
      </div>
  
      <!-- File Selected Info -->
      <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
        Selected file: {{ selectedFile.name }}
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import UploadButton from './UploadButton.vue'
  
  export default {
    name: 'FileUploader',
    
    components: {
      UploadButton
    },
  
    data() {
      return {
        selectedFile: null,
        groupName: '',
        isLoading: false,
        error: ''
      }
    },
  
    computed: {
      canUpload() {
        return this.selectedFile && this.groupName.trim().length > 0;
      }
    },
  
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        if (file && !file.name.endsWith('.ics')) {
          this.error = 'Please select a valid ICS file';
          this.selectedFile = null;
          this.$refs.fileInput.value = '';
          return;
        }
        this.error = '';
        this.selectedFile = file;
      },
  
      async handleUpload() {
        if (!this.canUpload) return;
  
        this.isLoading = true;
        this.error = '';
  
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('groupName', this.groupName.trim());
  
        try {
          const response = await fetch('/api/schedule/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Upload failed');
          }
  
          const result = await response.json();
          this.$emit('upload-success', result);
          this.resetForm();
        } catch (err) {
          this.error = 'Failed to upload schedule. Please try again.';
          this.$emit('error', this.error);
        } finally {
          this.isLoading = false;
        }
      },
  
      resetForm() {
        this.selectedFile = null;
        this.groupName = '';
        this.error = '';
        this.$refs.fileInput.value = '';
      }
    }
  }
  </script>
  
  <style scoped>
  .upload-container {
    width: 100%;
    max-width: 800px;
  }
  
  input[type="text"] {
    min-width: 200px;
  }
  </style>