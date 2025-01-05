import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { fetchGrades, addGrade, updateGrade, deleteGrade } from '@/services/gradesService';

export function useGrades() {
    const toast = useToast();
    const grades = ref([]);
    const rowCount = ref(0);
    const modalOpen = ref(false);
    const currentGrade = ref(null);
    const modalMode = ref('add');
    const gridApi = ref(null);

    const updateRowCount = () => {
        if (gridApi.value) {
            rowCount.value = gridApi.value.getDisplayedRowCount();
        }
    };


    const fetchGradesData = async () => {
        try {
            grades.value = await fetchGrades();
        } catch (error) {
            if (error.response?.status !== 401) {
                toast.error('Failed to fetch grades');
                console.error('Error fetching grades:', error);
            }
        }
    };

    const onGridReady = (params) => {
        gridApi.value = params.api;
        updateRowCount();
    };

    const openAddGradeModal = () => {
        currentGrade.value = {
            subjectName: '',
            grade: '',
            comment: ''
        };
        modalMode.value = 'add';
        modalOpen.value = true;
    };

    const openEditGradeModal = (grade) => {
        currentGrade.value = { ...grade };
        modalMode.value = 'edit';
        modalOpen.value = true;
    };

    const closeModal = () => {
        modalOpen.value = false;
        currentGrade.value = null;
    };

    const handleSaveGrade = async (gradeData) => {
        try {
            if (modalMode.value === 'add') {
                await addGrade(gradeData);
                toast.success('Grade added successfully');
            } else {
                await updateGrade(gradeData);
                toast.success('Grade updated successfully');
            }
            await fetchGradesData();
            closeModal();
        } catch (error) {
            toast.error(modalMode.value === 'add' ? 'Failed to add grade' : 'Failed to update grade');
        }
    };

    const handleDeleteGrade = async (gradeId) => {
        try {
            await deleteGrade(gradeId);
            await fetchGradesData();
            toast.success('Grade deleted successfully');
        } catch (error) {
            toast.error('Failed to delete grade');
        }
    };

    return {
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
    };
}