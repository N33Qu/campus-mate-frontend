<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Group Name Input -->
    <div class="w-full md:flex-1">
      <input 
        v-model="groupName" 
        type="text" 
        class="w-full px-3 py-2 border rounded"
        placeholder="Wprowadź nazwę grupy"
      />
    </div>

    <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      <!-- File Selection Button -->
      <div class="w-full sm:w-auto">
        <input 
          type="file" 
          ref="fileInput" 
          id="schedule-upload"
          accept=".ics" 
          @change="onFileChange"
          class="hidden"
        />
        <button 
          @click="$refs.fileInput.click()"
          class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Wybierz plik ICS
        </button>
      </div>

      <!-- Upload Button -->
      <button 
        @click="handleUpload"
        :disabled="!canUpload || isUploading"
        class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <!-- Loading Spinner -->
        <svg 
          v-if="isUploading"
          class="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        {{ isUploading ? 'Wgrywanie...' : 'Wgraj plik' }}
      </button>
    </div>

    <!-- File Name Display -->
    <div class="text-sm text-gray-600 truncate w-full md:w-auto" v-if="selectedFile">
      {{ selectedFile.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  
  data() {
    return {
      selectedFile: null,
      groupName: '',
      isUploading: false,
      error: '',
      maxRetries: 10,
      retryDelay: 1000 // 1 second
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
        this.$emit('error', 'Proszę wybrać prawidłowy plik ICS');
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
        return;
      }
      this.selectedFile = file;
    },

    async checkUploadStatus(groupName, retryCount = 0) {
      try {
        const response = await fetch('/api/schedule', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to check schedule status');
        }

        const schedules = await response.json();
        const groupExists = schedules.some(schedule => schedule.group === groupName);

        if (groupExists) {
          return true;
        }

        if (retryCount < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.checkUploadStatus(groupName, retryCount + 1);
        }

        throw new Error('Upload verification timeout');
      } catch (error) {
        console.error('Error checking upload status:', error);
        throw error;
      }
    },

    async handleUpload() {
      if (!this.canUpload || this.isUploading) return;

      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('groupName', this.groupName.trim());

      try {
        const response = await fetch('/api/schedule/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Błąd wgrywania');
        }

        // Show success message
        this.showSuccessMessage('Wgrywanie planu...');

        // Wait for the upload to be processed
        await this.checkUploadStatus(this.groupName.trim());

        // Emit success event
        this.$emit('upload-success');
        
        // Update success message
        this.showSuccessMessage('Plan został pomyślnie wgrany. Odświeżanie strony...');

        // Reset form
        this.resetForm();

        // Refresh page
        window.location.reload();

      } catch (err) {
        this.$emit('error', 'Nie udało się wgrać planu zajęć');
        this.showErrorMessage('Wystąpił błąd podczas wgrywania planu');
      } finally {
        this.isUploading = false;
      }
    },

    resetForm() {
      this.selectedFile = null;
      this.groupName = '';
      this.$refs.fileInput.value = '';
    },

    showSuccessMessage(message) {
      this.showMessage(message, 'bg-green-500');
    },

    showErrorMessage(message) {
      this.showMessage(message, 'bg-red-500');
    },

    showMessage(message, className) {
      // Remove any existing messages
      const existingMessage = document.querySelector('.status-message');
      if (existingMessage) {
        existingMessage.remove();
      }

      // Create message element
      const messageDiv = document.createElement('div');
      messageDiv.className = `status-message fixed top-4 right-4 ${className} text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-500`;
      messageDiv.textContent = message;
      
      // Add to document
      document.body.appendChild(messageDiv);
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.status-message {
  animation: fadeIn 0.3s ease-in-out;
}
</style>