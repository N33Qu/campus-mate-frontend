<!-- src/views/GradesView.vue -->
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

<script setup>
import { ref, onMounted, computed } from 'vue'
import { AgGridVue } from "ag-grid-vue3"
import { useToast } from 'vue-toastification'
import { fetchGrades, addGrade, updateGrade, deleteGrade } from '@/axios.js'

import GradeModal from '@/components/grade/GradeModal.vue'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

const toast = useToast()

// Grid References
const gridApi = ref(null)
const rowCount = ref(0)

// State Management
const grades = ref([])
const modalOpen = ref(false)
const currentGrade = ref(null)
const modalMode = ref('add')

// Column Definitions
const columnDefs = ref([
  {
    headerName: 'Subject',
    field: 'subjectName',
    sortable: true,
    filter: true,
    editable: true
  },
  {
    headerName: 'Grade',
    field: 'grade',
    sortable: true,
    filter: 'agNumberColumnFilter',
    cellRenderer: (params) => {
      const grade = params.value
      let className = 'px-2 py-1 rounded font-semibold'

      if (grade >= 9) className += ' bg-green-200 text-green-800'
      else if (grade >= 7) className += ' bg-yellow-200 text-yellow-800'
      else if (grade >= 5) className += ' bg-orange-200 text-orange-800'
      else className += ' bg-red-200 text-red-800'

      return `<span class="${className}">${grade}</span>`
    }
  },
  {
    headerName: 'Comment',
    field: 'comment',
    editable: true
  },
  {
    headerName: 'Date',
    field: 'dateOfReceipt',
    sortable: true,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString()
    }
  },
  {
    headerName: 'Actions',
    cellRenderer: (params) => {
      return `
        <div class="flex justify-center space-x-2">
          <button class="edit-btn text-blue-500 hover:text-blue-700">Edit</button>
          <button class="delete-btn text-red-500 hover:text-red-700">Delete</button>
        </div>
      `
    },
    cellClass: 'flex justify-center items-center',
    width: 150,
    sortable: false,
    filter: false
  }
])

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  filter: true,
  resizable: true,
}

// Computed Properties
const averageGrade = computed(() => {
  if (grades.value.length === 0) return 'N/A'
  const total = grades.value.reduce((sum, grade) => sum + Number(grade.grade), 0)
  return (total / grades.value.length).toFixed(2)
})

// Grid Ready Handler
const onGridReady = (params) => {
  gridApi.value = params.api
  rowCount.value = params.api.getDisplayedRowCount()
}

// Cell Click Handler for Actions
const onCellClicked = (event) => {
  if (event.column.getColId() === 'actions') {
    const target = event.event.target

    if (target.classList.contains('edit-btn')) {
      openEditGradeModal(event.data)
    } else if (target.classList.contains('delete-btn')) {
      handleDeleteGrade(event.data.id)
    }
  }
}

// Fetch Grades
const fetchGradesData = async () => {
  try {
    grades.value = await fetchGrades()
    if (gridApi.value) {
      gridApi.value.setRowData(grades.value)
      rowCount.value = gridApi.value.getDisplayedRowCount()
    }
  } catch (error) {
    toast.error('Failed to fetch grades')
  }
}

// Refresh Grid
const refreshGrid = () => {
  fetchGradesData()
}

// Modal Handling
const openAddGradeModal = () => {
  currentGrade.value = {
    subjectName: '',
    grade: '',
    comment: ''
  }
  modalMode.value = 'add'
  modalOpen.value = true
}

const openEditGradeModal = (grade) => {
  currentGrade.value = { ...grade }
  modalMode.value = 'edit'
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  currentGrade.value = null
}

// Grade Actions
const handleSaveGrade = async (gradeData) => {
  try {
    if (modalMode.value === 'add') {
      const newGrade = await addGrade(gradeData)
      grades.value.push(newGrade)
      toast.success('Grade added successfully')
    } else {
      const updatedGrade = await updateGrade(gradeData.id, gradeData)
      const index = grades.value.findIndex(g => g.id === gradeData.id)
      if (index !== -1) {
        grades.value[index] = updatedGrade
      }
      toast.success('Grade updated successfully')
    }

    // Update grid data
    if (gridApi.value) {
      gridApi.value.setRowData(grades.value)
      rowCount.value = gridApi.value.getDisplayedRowCount()
    }

    closeModal()
  } catch (error) {
    toast.error('Failed to save grade')
  }
}

const handleDeleteGrade = async (gradeId) => {
  try {
    await deleteGrade(gradeId)
    grades.value = grades.value.filter(g => g.id !== gradeId)

    // Update grid data
    if (gridApi.value) {
      gridApi.value.setRowData(grades.value)
      rowCount.value = gridApi.value.getDisplayedRowCount()
    }

    toast.success('Grade deleted successfully')
  } catch (error) {
    toast.error('Failed to delete grade')
  }
}

// Lifecycle
onMounted(fetchGradesData)
</script>