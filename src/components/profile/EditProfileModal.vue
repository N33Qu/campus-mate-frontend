<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { profileSchema } from '@/validation/profileSchema.js';


const props = defineProps({
  modelValue: Boolean,
  initialValues: {
    type: Object,
    required: true
  },
  isLoading: Boolean
});

const emit = defineEmits(['update:modelValue', 'save']);

const onSubmit = async (values) => {
  emit('save', values);
};
</script>


<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4">
      <div class="fixed inset-0 bg-black opacity-30"></div>

      <div class="relative bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-medium mb-4">Edit Profile</h3>

        <Form
            @submit="onSubmit"
            :validation-schema="profileSchema"
            :initial-values="initialValues"
            v-slot="{ errors }"
        >
          <div class="space-y-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <Field
                  name="firstName"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors.firstName }"
              />
              <ErrorMessage name="firstName" class="mt-1 text-sm text-red-600" />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <Field
                  name="lastName"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors.lastName }"
              />
              <ErrorMessage name="lastName" class="mt-1 text-sm text-red-600" />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                  type="button"
                  @click="$emit('update:modelValue', false)"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>