import { ref, watch } from 'vue';
import { fetchGrades, addGrade, updateGrade, deleteGrade } from '@/services/gradesService.js';
import { useShowNotification } from "@/composables/useShowNotification.js";

export function useGrades() {
    const grades = ref([]);
    const rowCount = ref(0);
    const modalOpen = ref(false);
    const currentGrade = ref(null);
    const modalMode = ref('add');
    const gridApi = ref(null);
    const selectedGrade = ref(null);
    const { showNotification } = useShowNotification()  // Destructure the function

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
                    showNotification('Brak ocen', 'info');
                } else {
                    showNotification('Błąd pobierania ocen', 'error');
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

    const openEditGradeModal = async (grade) => {
        try {
            await fetchGradesData();
            const currentGradeData = grades.value.find(g => g.gradeId === grade.gradeId);

            if (!currentGradeData) {
                showNotification('Nie znaleziono oceny do edycji', 'error');
                return;
            }

            currentGrade.value = {
                ...currentGradeData,
                grade: currentGradeData.grade
            };
            modalMode.value = 'edit';
            modalOpen.value = true;
        } catch (error) {
            showNotification('Błąd podczas ładowania oceny', 'error');
            console.error('Error loading grade for edit:', error);
        }
    };

    const closeModal = () => {
        modalOpen.value = false;
        modalMode.value = 'add';
        currentGrade.value = null;
    };

    const handleSaveGrade = async (gradeData) => {
        try {
            if (modalMode.value === 'add') {
                await addGrade(gradeData);
                showNotification('Ocena dodana pomyślnie');
            } else {
                await updateGrade(gradeData);
                showNotification('Ocena zaktualizowana pomyślnie');
            }
            await fetchGradesData();
            closeModal();
            updateRowCount()
        } catch (error) {
            const errorMessage = modalMode.value === 'add'
                ? 'Błąd dodawania oceny'
                : 'Błąd aktualizacji oceny';
            showNotification(errorMessage, 'error');
        }
    };

    const handleDeleteGrade = async (gradeId) => {
        try {
            await deleteGrade(gradeId);
            await fetchGradesData();
            updateRowCount()
            showNotification('Ocena usunięta pomyślnie');
        } catch (error) {
            showNotification('Błąd usuwania oceny', 'error');
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