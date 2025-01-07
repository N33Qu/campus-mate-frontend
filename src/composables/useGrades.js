import { ref, watch } from 'vue';
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
    const selectedGrade = ref(null);

    // Watch for changes in the grades array and update row count
    watch(grades, () => {
        updateRowCount();
    });

    const updateRowCount = () => {
        if (gridApi.value) {
            rowCount.value = gridApi.value.getDisplayedRowCount();
        } else {
            rowCount.value = grades.value.length;
        }
    };

    const fetchGradesData = async () => {
        try {
            grades.value = await fetchGrades();
            updateRowCount();
        } catch (error) {
            if (error.response?.status !== 401) {
                if (error.response?.status === 404) {
                    console.error('Grades not found');
                } else {
                    toast.error('Błąd pobierania ocen');
                    console.error('Error fetching grades:', error);
                }
            }
        }
    };

    const onGridReady = (params) => {
        gridApi.value = params.api;
        updateRowCount();
    };

    const handleRowClick = (grade) => {
        console.log(grade);
        selectedGrade.value = grade;
    };

    const closeDetailsView = () => {
        selectedGrade.value = null;
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
                toast.success('Ocena dodana pomyślnie');
            } else {
                await updateGrade(gradeData);
                toast.success('Ocena zaktualizowana pomyślnie');
            }
            await fetchGradesData();
            closeModal();
        } catch (error) {
            toast.error(modalMode.value === 'add' ? 'Błąd dodawania oceny' : 'Błąd aktualizacji oceny');
        }
    };

    const handleDeleteGrade = async (gradeId) => {
        try {
            await deleteGrade(gradeId);
            await fetchGradesData();
            toast.success('Ocena usunięta pomyślnie');
        } catch (error) {
            toast.error('Błąd usuwania oceny');
        }
    };

    return {
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
        closeDetailsView
    };
}