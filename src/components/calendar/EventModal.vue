<script setup>
import ViewEventModal from './ViewEventModal.vue'
import EditEventModal from './EditEventModal.vue'

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
    default: 'view', // 'view' or 'edit'
    validator: value => ['view', 'edit'].includes(value)
  }
})

const emit = defineEmits(['close', 'update', 'delete'])

const handleClose = () => {
  emit('close')
}

const handleEdit = (updatedEvent) => {
  emit('update', updatedEvent)
}

const handleDelete = () => {
  emit('delete', props.selectedEvent.eventId)
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
        v-else
        :event="selectedEvent"
        @close="handleClose"
        @save="handleEdit"
    />
  </div>
</template>