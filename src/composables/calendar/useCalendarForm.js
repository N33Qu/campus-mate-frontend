import {useForm} from 'vee-validate';
import {ref} from 'vue';

export function useCalendarForm(schema, { mode, currentEvent }) {
    const isSubmitting = ref(false);

    const getInitialValues = () => {
        if (mode === 'edit' && currentEvent) {
            return {
                title: currentEvent.eventName || '',
                description: currentEvent.eventDescription || '',
                start: new Date(currentEvent.startDate).toISOString().split('T')[0],
                end: new Date(currentEvent.endDate).toISOString().split('T')[0],
            };
        }

        const startDate = currentEvent?.startDate ? new Date(currentEvent.startDate) : new Date();
        const endDate = currentEvent?.endDate ? new Date(currentEvent.endDate) : new Date();
        return {
            title: '',
            description: '',
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
        };
    }

    const {
        errors,
        defineField,
        values,
        validate,
        resetForm
    } = useForm({
        validationSchema: schema,
        initialValues: getInitialValues()
    });

    const [title, titleProps] = defineField('title');
    const [description, descriptionProps] = defineField('description');
    const [start, startProps] = defineField('start');
    const [end, endProps] = defineField('end');
    const [teamId, teamIdProps] = defineField('teamId');

    const onSubmit = async () => {
        isSubmitting.value = true;

        try {
            const validationResult = await validate();
            if (!validationResult.valid) {
                console.log('Validation failed:', errors.value);
                return null;
            }

            return {
                title: values.title,
                description: values.description || '',
                start: values.start,
                end: values.end,
                teamId: values.teamId ? parseInt(values.teamId) : undefined
            };
        } catch (error) {
            console.error('Validation error:', error);
            return null;
        } finally {
            isSubmitting.value = false;
        }
    };

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
        onSubmit,
        values,
        resetForm
    };
}