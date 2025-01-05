<script setup>
import { onMounted } from 'vue';
import GradesGrid from '@/components/grade/GradesGrid.vue';
import GradeModal from '@/components/grade/GradeModal.vue';
import { useGrades } from '@/composables/useGrades';

const {
  grades,
  rowCount,
  modalOpen,
  currentGrade,
  modalMode,
  onGridReady,
  fetchGradesData,
  openAddGradeModal,
  openEditGradeModal,
  closeModal,
  handleSaveGrade,
  handleDeleteGrade
} = useGrades();

onMounted(fetchGradesData);
</script>

<template>
  <div class="grades-container p-6 bg-gray-100 min-h-screen">
    <div class="max-w-full mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">My Grades</h1>

      <GradesGrid
          :grades="grades"
          :row-count="rowCount"
          @add-grade="openAddGradeModal"
          @edit-grade="openEditGradeModal"
          @delete-grade="handleDeleteGrade"
          @refresh="fetchGradesData"
          @grid-ready="onGridReady"
      />

      <GradeModal
          :is-open="modalOpen"
          :current-grade="currentGrade"
          :mode="modalMode"
          @close="closeModal"
          @save-grade="handleSaveGrade"
      />
    </div>
  </div>
</template>