<script setup>
defineProps({
  grade: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const getGradeClass = (grade) => {
  if (grade >= 5) return 'bg-green-200 text-green-800';
  if (grade >= 4) return 'bg-yellow-200 text-yellow-800';
  if (grade >= 3) return 'bg-orange-200 text-orange-800';
  return 'bg-red-200 text-red-800';
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">
          Grade Details for {{ grade.subjectName }}
        </h2>
        <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-600">Przedmiot</h3>
            <p class="mt-1">{{ grade.subjectName }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-600">Ocena</h3>
            <p :class="['mt-1 inline-block px-2 py-1 rounded font-semibold', getGradeClass(grade.grade)]">
              {{ grade.grade }}
            </p>
          </div>
          <div class="col-span-2">
            <h3 class="font-semibold text-gray-600">Komentarz</h3>
            <p class="mt-1">{{ grade.comment }}</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-600">Data wystawienia</h3>
            <p class="mt-1">
              {{ new Date(grade.dateOfReceipt).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>