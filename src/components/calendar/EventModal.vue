<script setup>
import ViewEventModal from './ViewEventModal.vue'
import EditEventModal from './EditEventModal.vue'
import CreateEventModal from './CreateEventModal.vue'

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
  },
  canEdit: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'update', 'delete', 'edit', 'create'])

const handleClose = () => {
  emit('close')
}

const handleSave = (eventData) => {
  if (props.mode === 'edit') {
    emit('update', eventData)
  } else if (props.mode === 'create') {
    emit('create', eventData)
  }
  handleClose()
}

const handleDelete = () => {
  emit('delete')
}

</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <ViewEventModal
        v-if="mode === 'view'"
        :event="selectedEvent"
        :can-edit="canEdit"
        @close="handleClose"
        @edit="$emit('edit')"
        @delete="handleDelete"
    />
    <EditEventModal
        v-else-if="mode === 'edit' && canEdit"
        :is-open="isOpen"
        :current-event="selectedEvent"
        @close="handleClose"
        @save="handleSave"
    />
    <CreateEventModal
        v-else-if="mode === 'create' && canEdit"
        :is-open="isOpen"
        :initial-dates="selectedEvent"
        @close="handleClose"
        @save="handleSave"
    />
  </div>
</template>