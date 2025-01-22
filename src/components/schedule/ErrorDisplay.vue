<template>
    <div v-if="message" class="error-alert mb-4 p-4 bg-red-100 text-red-700 rounded">
      <i class="alert-icon"></i>
      <span>{{ message }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorDisplay',
    props: {
      message: {
        type: String,
        default: ''
      }
    }
  };
  </script>