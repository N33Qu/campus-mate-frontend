<!-- components/SearchBar.vue -->
<script setup>
defineProps({
  modelValue: String,
  placeholder: String
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="p-4">
    <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full px-4 py-2 rounded-lg border
        bg-stone-200
        text-stone-700
        focus:outline-none
        focus:ring-2
        focus:ring-stone-800"
    />
  </div>
</template>