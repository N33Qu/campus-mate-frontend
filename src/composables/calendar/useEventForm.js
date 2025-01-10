import { useForm } from "vee-validate";
import { ref } from "vue";

export function useEventForm(schema, initialEvent = null) {
    const isSubmitting = ref(false);

    const defaultValues = {
        title: '',
        description: '',
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
        teamId: ''
    };


    const { handleSubmit, errors, defineField } = useForm({
        validationSchema: schema,
        initialValues: initialEvent || defaultValues
    });

    const [title, titleProps] = defineField('title');
    const [description, descriptionProps] = defineField('description');
    const [start, startProps] = defineField('start');
    const [end, endProps] = defineField('end');
    const [teamId, teamIdProps] = defineField('teamId');

    const onSubmit = handleSubmit(async (values) => {
        isSubmitting.value = true;
        try {
            return {
                ...values,
                start: new Date(values.start),
                end: new Date(values.end),
                teamId: Number(values.teamId)
            };
        } finally {
            isSubmitting.value = false;
        }
    });

    return {
        title,
        titleProps,
        description,
        descriptionProps,
        start,
        startProps,
        end,
        endProps,
        teamId,
        teamIdProps,
        errors,
        isSubmitting,
        onSubmit
    };
}