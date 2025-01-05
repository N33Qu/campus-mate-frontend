<script setup>
defineProps({
  entry: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="p-4 hover:bg-stone-100 transition-colors">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-stone-700">
          {{ entry.contactName }}
        </h3>
        <div class="text-stone-600 space-y-1">
          <p>
            <span class="font-medium">Email:</span>
            <a
                :href="`mailto:${entry.email}`"
                class="text-stone-500 hover:text-stone-800 transition-colors"
            >
              {{ entry.email }}
            </a>
          </p>
          <p>
            <span class="font-medium">Telefon:</span>
            {{ entry.phoneNumber }}
          </p>
          <p v-if="entry.classNumber">
            <span class="font-medium">Numer klasy:</span>
            {{ entry.classNumber }}
          </p>
          <p v-if="entry.notes" class="italic text-stone-500">
            {{ entry.notes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>