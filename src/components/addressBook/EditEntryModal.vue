<script setup>
import { addressBookSchema } from '@/validation/addressBookSchema';
import { useAddressBookForm } from '@/composables/addressBook/useAddressBookForm.js';

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const {
  contactName,
  contactNameProps,
  email,
  emailProps,
  phoneNumber,
  phoneNumberProps,
  classNumber,
  classNumberProps,
  notes,
  notesProps,
  errors,
  isSubmitting,
  onSubmit
} = useAddressBookForm(addressBookSchema, props.entry);

const handleSubmit = async () => {
  const result = await onSubmit();
  if (result) {
    emit('save', result);
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full">
      <h2 class="text-2xl font-bold mb-4">Edytuj wpis</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nazwa kontaktu</label>
          <input
              v-model="contactName"
              v-bind="contactNameProps"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.contactName }"
          />
          <p v-if="errors.contactName" class="mt-1 text-sm text-red-600">
            {{ errors.contactName }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
              v-model="email"
              v-bind="emailProps"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Telefon</label>
          <input
              v-model="phoneNumber"
              v-bind="phoneNumberProps"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.phoneNumber }"
          />
          <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">
            {{ errors.phoneNumber }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Numer klasy</label>
          <input
              v-model="classNumber"
              v-bind="classNumberProps"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.classNumber }"
          />
          <p v-if="errors.classNumber" class="mt-1 text-sm text-red-600">
            {{ errors.classNumber }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Notatki</label>
          <textarea
              v-model="notes"
              v-bind="notesProps"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.notes }"
              rows="3"
          ></textarea>
          <p v-if="errors.notes" class="mt-1 text-sm text-red-600">
            {{ errors.notes }}
          </p>
        </div>

        <div class="flex justify-end space-x-2">
          <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-saveButton hover:bg-saveButtonHover disabled:opacity-50"
              :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Zapisywanie...' : 'Zapisz' }}
          </button>
          <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-cancelButton hover:bg-cancelButtonHover"
              :disabled="isSubmitting"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  </div>
</template>