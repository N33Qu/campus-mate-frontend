<script setup>
import { ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@shadcn/vue';
import { Button } from '@shadcn/vue';

// Define props for the component
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'destructive', 'outline', 'secondary'].includes(value)
  }
});

// Define emits for the component
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// Handle dialog close
const handleClose = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

// Handle confirmation
const handleConfirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};
</script>

<template>
  <Dialog
      :open="modelValue"
      @update:open="handleClose"
  >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ message }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
            variant="outline"
            @click="handleClose"
        >
          {{ cancelText }}
        </Button>
        <Button
            :variant="variant"
            @click="handleConfirm"
        >
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>