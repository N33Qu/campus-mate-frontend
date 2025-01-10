<script setup>
import { eventSchema } from '@/validation/eventSchema';
import { useEventForm } from '@/composables/calendar/useEventForm.js';

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);


const initialData = {
  title: props.event.eventName,
  description: props.event.eventDescription || '',
  start: new Date(props.event.startDate).toISOString().slice(0, 16),
  end: new Date(props.event.endDate).toISOString().slice(0, 16),
  teamId: props.event.teamId
};

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
  onSubmit
} = useEventForm(eventSchema, initialData);



const handleSubmit = async () => {
  const result = await onSubmit();
  if (result) {
    const eventData = {
      eventId: props.event.eventId,
      eventName: result.title,
      eventDescription: result.description || '',
      startDate: result.start,
      endDate: result.end,
      teamId: result.teamId
    };
    emit('save', eventData);
  }
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
        <span v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</span>
        <span class="text-sm text-gray-500">{{ title?.length || 0 }}/50</span>
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
        <span v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</span>
        <span class="text-sm text-gray-500">{{ description?.length || 0 }}/200</span>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Rozpoczęcie</label>
        <input
            v-model="start"
            v-bind="startProps"
            type="datetime-local"
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
            type="datetime-local"
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