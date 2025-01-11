import { useForm } from "vee-validate";
import {ref, watch} from "vue";

export function useGradeForm(schema, props) {
    const isSubmitting = ref(false);

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
    } : defaultValues;

    const { handleSubmit, errors, defineField, resetForm} = useForm({
        validationSchema: schema,
        initialValues,
        validationContext: {
            mode: props.mode
        }
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
        onSubmit
    };
}