<script setup>
import { eventSchema } from '@/validation/eventSchema';
import { useCalendarForm } from '@/composables/calendar/useCalendarForm.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  currentEvent: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const {
  title,
  titleProps,
  description,
  descriptionProps,
  start,
  startProps,
  end,
  endProps,
  errors,
  isSubmitting,
  onSubmit,
  values
} = useCalendarForm(eventSchema, {
  mode: 'edit',
  currentEvent: props.currentEvent
});

const handleSubmit = async () => {
  const formResult = await onSubmit();

  if (!formResult) {
    console.error('Form validation failed');
    return;
  }

  const eventData = {
    eventId: props.currentEvent.eventId,
    eventName: formResult.title,
    eventDescription: formResult.description,
    startDate: new Date(formResult.start + 'T00:00:00').toISOString(),
    endDate: new Date(formResult.end + 'T23:59:59').toISOString(),
  };

  emit('save', eventData);
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h3 class="text-xl font-bold mb-4">Edytuj wydarzenie</h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Tytuł</label>
        <input
            v-model="title"
            v-bind="titleProps"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            :class="{ 'border-red-500': errors.title }"
        />
        <span class="text-sm text-gray-500">{{ title?.length || 0 }}/50</span>
        <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Opis</label>
        <textarea
            v-model="description"
            v-bind="descriptionProps"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            :class="{ 'border-red-500': errors.description }"
            rows="3"
        ></textarea>
        <span class="text-sm text-gray-500">{{ description?.length || 0 }}/200</span>
        <span v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Rozpoczęcie</label>
        <input
            v-model="start"
            v-bind="startProps"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            :class="{ 'border-red-500': errors.start }"
        />
        <span v-if="errors.start" class="text-sm text-red-500">{{ errors.start }}</span>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Zakończenie</label>
        <input
            v-model="end"
            v-bind="endProps"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            :class="{ 'border-red-500': errors.end }"
        />
        <span v-if="errors.end" class="text-sm text-red-500">{{ errors.end }}</span>
      </div>

      <div class="flex gap-2">
        <button
            type="submit"
            class="bg-saveButton text-white px-4 py-2 rounded hover:bg-saveButtonHover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Zapisywanie...' : 'Zapisz' }}
        </button>
        <button
            type="button"
            @click="$emit('close')"
            class="bg-cancelButton text-white px-4 py-2 rounded hover:bg-cancelButtonHover transition-colors"
        >
          Anuluj
        </button>
      </div>
    </form>
  </div>
</template>