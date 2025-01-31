import { useForm } from "vee-validate";
import { ref } from "vue";

export function useAddressBookForm(schema, initialEntry = null) {
    const isSubmitting = ref(false);

    const defaultValues = {
        contactName: '',
        email: '',
        phoneNumber: '',
        classNumber: '',
        notes: ''
    };

    const { handleSubmit, errors, defineField } = useForm({
        validationSchema: schema,
        initialValues: initialEntry || defaultValues
    });

    const [contactName, contactNameProps] = defineField('contactName');
    const [email, emailProps] = defineField('email');
    const [phoneNumber, phoneNumberProps] = defineField('phoneNumber');
    const [classNumber, classNumberProps] = defineField('classNumber');
    const [notes, notesProps] = defineField('notes');

    const onSubmit = handleSubmit(async (values) => {
        isSubmitting.value = true;
        try {
            if (initialEntry?.entryId) {
                return {
                    ...values,
                    entryId: initialEntry.entryId
                };
            }
            return values;
        } finally {
            isSubmitting.value = false;
        }
    });

    return {
        contactName,
        contactNameProps,
        email,
        emailProps,
        phoneNumber,
        phoneNumberProps,
        classNumber,
        classNumberProps,
        notes,
        notesProps,
        errors,
        isSubmitting,
        onSubmit
    };
}