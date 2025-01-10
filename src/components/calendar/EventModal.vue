<script setup>
import ViewEventModal from './ViewEventModal.vue'
import EditEventModal from './EditEventModal.vue'
import CreateEventModal from "@/components/calendar/CreateEventModal.vue";

const props = defineProps({
  selectedEvent: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    default: 'view',
    validator: value => ['view', 'edit', 'create'].includes(value)
  }
})

const emit = defineEmits(['close', 'update', 'delete', 'edit', 'create'])

const handleClose = () => {
  emit('close')
}

const handleEdit = (updatedEvent) => {
  emit('update', updatedEvent)
}

const handleDelete = () => {
  emit('delete', props.selectedEvent.eventId)
}

const handleCreate = (eventData) => {
  emit('create', eventData)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <ViewEventModal
        v-if="mode === 'view'"
        :event="selectedEvent"
        @close="handleClose"
        @edit="$emit('edit')"
        @delete="handleDelete"
    />
    <EditEventModal
        v-else-if="mode === 'edit'"
        :event="selectedEvent"
        @close="handleClose"
        @save="handleEdit"
    />
    <CreateEventModal
        v-else
        @close="handleClose"
        @save="handleCreate"
    />
  </div>
</template>