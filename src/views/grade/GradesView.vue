<script setup>
import {onMounted, watch} from 'vue';
import GradesGrid from '@/components/grade/GradesGrid.vue';
import GradeModal from '@/components/grade/GradeModal.vue';
import GradeDetailsView from '@/components/grade/GradeDetails.vue';
import { useGrades } from '@/composables/grade/useGrades.js';

const {
  grades,
  rowCount,
  modalOpen,
  currentGrade,
  modalMode,
  selectedGrade,
  onGridReady,
  fetchGradesData,
  openAddGradeModal,
  openEditGradeModal,
  closeModal,
  handleSaveGrade,
  handleDeleteGrade,
  handleRowClick,
  closeDetailsView,

} = useGrades();

onMounted(fetchGradesData);
</script>

<template>
  <div class="grades-container p-6">
      <GradesGrid
          :grades="grades"
          :row-count="rowCount"
          @add-grade="openAddGradeModal"
          @edit-grade="openEditGradeModal"
          @delete-grade="handleDeleteGrade"
          @refresh="fetchGradesData"
          @grid-ready="onGridReady"
          @row-click="handleRowClick"
      />

      <GradeModal
          :is-open="modalOpen"
          :current-grade="currentGrade"
          :mode="modalMode"
          @close="closeModal"
          @save-grade="handleSaveGrade"
      />

      <Teleport to="body">
        <div
            v-if="selectedGrade"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            @click.self="closeDetailsView"
        >
          <GradeDetailsView
              :grade="selectedGrade"
              @close="closeDetailsView"
          />
        </div>
      </Teleport>
    </div>
</template>