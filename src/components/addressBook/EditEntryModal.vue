<script setup>
import { ref, computed } from 'vue';
import { addressBookSchema } from '@/validation/addressBookSchema';
import {usePhoneValidation} from "@/composables/usePhoneValidation.js";

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
  contactName: props.entry.contactName || '',
  email: props.entry.email || '',
  phoneNumber: props.entry.phoneNumber || '',
  classNumber: props.entry.classNumber || '',
  notes: props.entry.notes || ''
});

const errors = ref({});
const isSubmitting = ref(false);

const hasErrors = computed(() => Object.keys(errors.value).length > 0);

const validateField = async (field) => {
  try {
    await addressBookSchema.validateAt(field, formData.value);
    delete errors.value[field];
  } catch (err) {
    errors.value[field] = err.message;
  }
};

const handleInput = (field) => {
  validateField(field);
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errors.value = {};

  try {
    const validatedData = await addressBookSchema.validate(formData.value, {
      abortEarly: false
    });

    emit('save', {
      entryId: props.entry.entryId,
      ...validatedData
    });
  } catch (err) {
    if (err.inner) {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const { validatePhoneNumber } = usePhoneValidation();
const phoneError = ref('');

const handlePhoneInput = () => {
  const validationResult = validatePhoneNumber(formData.value.phoneNumber);
  phoneError.value = validationResult === true ? '' : validationResult;
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
              v-model="formData.contactName"
              type="text"
              @input="handleInput('contactName')"
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
              v-model="formData.email"
              type="email"
              @input="handleInput('email')"
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
              v-model="formData.phoneNumber"
              type="tel"
              @input="handleInput('phoneNumber')"
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
              v-model="formData.classNumber"
              type="text"
              @input="handleInput('classNumber')"
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
              v-model="formData.notes"
              @input="handleInput('notes')"
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
              type="button"
              @click="emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              :disabled="isSubmitting"
          >
            Anuluj
          </button>
          <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              :disabled="isSubmitting || hasErrors"
          >
            {{ isSubmitting ? 'Zapisywanie...' : 'Zapisz' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>