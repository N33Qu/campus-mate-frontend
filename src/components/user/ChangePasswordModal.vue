<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { passwordSchema } from '@/validation/passwordSchema';

const props = defineProps({
  modelValue: Boolean,
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

      <div class="relative bg-elementLight rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-medium mb-4">Zmiana hasła</h3>

        <Form
            @submit="onSubmit"
            :validation-schema="passwordSchema"
            v-slot="{ errors }"
        >
          <div class="space-y-4">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Bieżące hasło</label>
              <Field
                  name="currentPassword"
                  type="password"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-appBg focus:border-appBg"
                  :class="{ 'border-red-500': errors.currentPassword }"
              />
              <ErrorMessage name="currentPassword" class="mt-1 text-sm text-red-600" />
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">New Password</label>
              <Field
                  name="newPassword"
                  type="password"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-appBg focus:border-border-appBg"
                  :class="{ 'border-red-500': errors.newPassword }"
              />
              <ErrorMessage name="newPassword" class="mt-1 text-sm text-red-600" />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Field
                  name="confirmPassword"
                  type="password"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-appBg focus:border-appBg"
                  :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <ErrorMessage name="confirmPassword" class="mt-1 text-sm text-red-600" />
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
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-saveButton hover:bg-saveButtonHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isLoading ? 'Saving...' : 'Change Password' }}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

