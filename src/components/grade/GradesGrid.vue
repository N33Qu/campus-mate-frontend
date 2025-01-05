<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { useGrid, defaultColDef } from '@/composables/useGrid';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import {computed} from "vue";

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

const emit = defineEmits(['edit-grade', 'delete-grade', 'add-grade', 'grid-ready']);

const { columnDefs, onCellClicked } = useGrid(props.grades);
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
  <div class="bg-white shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-2">
        <button
            @click="$emit('add-grade')"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Add New Grade
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <span class="font-semibold">Total Grades: {{ rowCount }}</span>
        <span class="font-semibold">Average Grade: {{ averageGrade }}</span>
      </div>
    </div>

    <ag-grid-vue
        class="ag-theme-alpine h-[500px] w-full"
        :rowData="props.grades"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="10"
        :paginationPageSizeSelector="[10, 20, 50, 100]"
        :rowSelection="{ type: 'multiple' }"
        @cell-clicked="handleCellClicked"
        @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>