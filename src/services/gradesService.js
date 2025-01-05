import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/axios.js'


export async function fetchGrades(){
    try {
        const response = await api.get("/grade");
        return response.data.map((gradeDto) => ({
            subjectName: gradeDto.subjectName,
            grade: gradeDto.grade,
            comment: gradeDto.comment,
            dateOfReceipt: new Date(gradeDto.dateOfReceipt)
        }));
    } catch (error) {
        console.error("Error fetching grades:", error);
        throw error;
    }
}

export async function addGrade(gradeData){
    try {
        const response = await api.post("/grade", {
            subjectName: gradeData.subjectName,
            grade: gradeData.grade,
            comment: gradeData.comment,
            userId: gradeData.id
        });

        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error adding grade:", error);
        throw error;
    }
}

export async function updateGrade(gradeId, gradeData){
    try {
        const response = await api.put(`/grade/${gradeId}`, gradeData);

        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error updating grade:", error);
        throw error;
    }
}

export async function deleteGrade(gradeId){
    try {
        await api.delete(`/grade/${gradeId}`);
    } catch (error) {
        console.error("Error deleting grade:", error);
        throw error;
    }
}
export function useGrades() {
    const toast = useToast()
    const grades = ref([])
    const modalOpen = ref(false)
    const currentGrade = ref(null)
    const modalMode = ref('add')
    const gridApi = ref(null)
    const rowCount = ref(0)

    const averageGrade = computed(() => {
        if (grades.value.length === 0) return 'N/A'
        const total = grades.value.reduce((sum, grade) => sum + Number(grade.grade), 0)
        return (total / grades.value.length).toFixed(2)
    })

    // Grid methods
    const onGridReady = (params) => {
        gridApi.value = params.api
        rowCount.value = params.api.getDisplayedRowCount()
    }

    const updateGridData = (data) => {
        if (gridApi.value) {
            gridApi.value.setRowData(data)
            rowCount.value = gridApi.value.getDisplayedRowCount()
        }
    }

    // Modal methods
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

    // Data manipulation methods
    const handleDeleteGrade = async (gradeId) => {
        try {
            await deleteGrade(gradeId)
            grades.value = grades.value.filter(g => g.id !== gradeId)
            updateGridData(grades.value)
            toast.success('Grade deleted successfully')
        } catch (error) {
            toast.error('Failed to delete grade')
        }
    }

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

    // Data fetching
    const fetchGradesData = async () => {
        try {
            grades.value = await fetchGrades()
            updateGridData(grades.value)
        } catch (error) {
            toast.error('Failed to fetch grades')
        }
    }

    const refreshGrid = () => {
        fetchGradesData()
    }

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

            updateGridData(grades.value)
            closeModal()
        } catch (error) {
            toast.error('Failed to save grade')
        }
    }

    return {
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
    }
}

export const createColumnDefs = () => [
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

            if (grade >= 5) className += ' bg-green-200 text-green-800'
            else if (grade >= 4) className += ' bg-yellow-200 text-yellow-800'
            else if (grade >= 3) className += ' bg-orange-200 text-orange-800'
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
]

export const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
}