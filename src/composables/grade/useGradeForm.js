import {useForm} from "vee-validate";
import {ref, watch} from "vue";
import {userService} from '@/services/userService.js';
import {teamService} from '@/services/teamService.js';

export function useGradeForm(schema, props) {
    const isSubmitting = ref(false);
    const students = ref([]);
    const isLoadingStudents = ref(false);
    const studentError = ref('');
    const teams = ref([]);
    const selectedTeamId = ref('');
    const isLoadingTeams = ref(false);

    const defaultValues = {
        subjectName: '',
        grade: '',
        comment: '',
        userId: ''
    };

    const initialValues = props.mode === 'edit' && props.currentGrade ? {
        subjectName: props.currentGrade.subjectName,
        grade: props.currentGrade.grade,
        comment: props.currentGrade.comment,
        userId: props.currentGrade.userId
    } : defaultValues;

    const { handleSubmit, errors, defineField, resetForm } = useForm({
        validationSchema: schema,
        initialValues,
        validationContext: {
            mode: props.mode
        }
    });

    const fetchTeams = async () => {
        try {
            isLoadingTeams.value = true;
            const response = await teamService.getTeams();
            if(!response) return
            teams.value = response.data;
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            isLoadingTeams.value = false;
        }
    };

    const fetchStudents = async (teamId = null) => {
        try {
            isLoadingStudents.value = true;
            studentError.value = '';

            let fetchedStudents;
            if (teamId) {
                const response = await teamService.getTeamUsers(teamId);
                fetchedStudents = response.data.filter(user => user.role === 'ROLE_STUDENT');
            } else {
                fetchedStudents = await userService.getAllUsersByRole('ROLE_STUDENT');
            }

            students.value = fetchedStudents;

            if (!fetchedStudents || fetchedStudents.length === 0) {
                studentError.value = 'Brak użytkowników';
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            studentError.value = 'Nie udało się pobrać listy uczniów';
        } finally {
            isLoadingStudents.value = false;
        }
    };

    fetchTeams().then();
    fetchStudents().then();


    watch(selectedTeamId, (newTeamId) => {
        fetchStudents(newTeamId || null).then();
    });

    watch(props, () => {
        if (props.mode === 'edit' && props.currentGrade) {
            resetForm({
                values: {
                    subjectName: props.currentGrade.subjectName,
                    grade: props.currentGrade.grade,
                    comment: props.currentGrade.comment,
                    userId: props.currentGrade.userId
                }
            });
        } else {
            resetForm({
                values: defaultValues
            });
            fetchStudents().then();
        }
    });

    const [subjectName, subjectNameProps] = defineField('subjectName');
    const [grade, gradeProps] = defineField('grade');
    const [comment, commentProps] = defineField('comment');
    const [userId, userIdProps] = defineField('userId');

    const onSubmit = handleSubmit(async (values) => {
        isSubmitting.value = true;
        try {
            return {
                ...values,
                grade: Number(values.grade),
                gradeId: props.currentGrade?.gradeId
            };
        } finally {
            isSubmitting.value = false;
        }
    });

    return {
        subjectName,
        subjectNameProps,
        grade,
        gradeProps,
        comment,
        commentProps,
        userId,
        userIdProps,
        errors,
        isSubmitting,
        onSubmit,
        students,
        isLoadingStudents,
        studentError,
        teams,
        selectedTeamId,
        isLoadingTeams,
        fetchStudents
    };
}