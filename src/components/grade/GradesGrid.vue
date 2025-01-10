<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { useGrid, defaultColDef } from '@/composables/grade/useGrid.js';
import GradesHeader from './GradesHeader.vue';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

import { computed } from "vue";
import { AG_GRID_LOCALE_PL } from '@ag-grid-community/locale';

const props = defineProps({
  grades: {
    type: Array,
    required: true
  },
  rowCount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['edit-grade', 'delete-grade', 'add-grade', 'grid-ready', 'row-click', 'refresh']);

const {columnDefs, onCellClicked} = useGrid(props.grades);

const onGridReady = (params) => {
  emit('grid-ready', params);
};

const handleCellClicked = (params) => {
  onCellClicked(params, emit);
};

const averageGrade = computed(() => {
  if (!props.grades || props.grades.length === 0) return 'N/A';
  const total = props.grades.reduce((sum, grade) => sum + Number(grade.grade), 0);
  return (total / props.grades.length).toFixed(2);
});
</script>

<template>
  <div class="bg-elementLight shadow-md rounded-lg p-4">
    <div class="max-w-full mx-auto">
      <GradesHeader
          :row-count="rowCount"
          :average-grade="averageGrade"
          @add-grade="emit('add-grade')"
          @refresh="emit('refresh')"
          class="mb-6"
      />

      <ag-grid-vue
          class="ag-theme-alpine h-[500px] w-full"
          :rowData="props.grades"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :pagination="true"
          :paginationPageSize="10"
          :paginationPageSizeSelector="[10, 20, 50, 100]"
          :rowSelection="{ type: 'multiple' }"
          :animateRows="true"
          :overlayNoRowsTemplate="`Nie znaleziono ocen.`"
          :overlayLoadingTemplate="`Ładowanie...`"
          :localeText="AG_GRID_LOCALE_PL"
          @cell-clicked="handleCellClicked"
          @grid-ready="onGridReady"

      >
      </ag-grid-vue>
    </div>
  </div>
</template>