<script setup>
import { onMounted, ref } from 'vue'
import { AgGridVue } from "ag-grid-vue3"
import { useGrades, createColumnDefs, defaultColDef } from '@/services/gradesService.js'
import GradeModal from '@/components/grade/GradeModal.vue'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

const {
  grades,
  rowCount,
  modalOpen,
  currentGrade,
  modalMode,
  averageGrade,
  onGridReady,
  onCellClicked,
  fetchGradesData,
  refreshGrid,
  openAddGradeModal,
  closeModal,
  handleSaveGrade
} = useGrades()

const columnDefs = ref(createColumnDefs())

onMounted(fetchGradesData)
</script>

<template>
  <div class="grades-container p-6 bg-gray-100 min-h-screen">
    <div class="max-w-full mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">My Grades</h1>

      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <button
                @click="openAddGradeModal"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Add New Grade
            </button>
            <button
                @click="refreshGrid"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Refresh
            </button>
          </div>
          <div class="flex items-center space-x-4">
            <span class="font-semibold">Total Grades: {{ rowCount }}</span>
            <span class="font-semibold">Average Grade: {{ averageGrade }}</span>
          </div>
        </div>

        <ag-grid-vue
            class="ag-theme-alpine h-[500px] w-full"
            :rowData="grades"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :pagination="true"
            :paginationPageSize="10"
            :rowSelection="'multiple'"
            @grid-ready="onGridReady"
            @cell-clicked="onCellClicked"
        >
        </ag-grid-vue>
      </div>
    </div>

    <GradeModal
        :is-open="modalOpen"
        :current-grade="currentGrade"
        :mode="modalMode"
        @close="closeModal"
        @save-grade="handleSaveGrade"
    />
  </div>
</template>