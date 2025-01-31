import * as yup from 'yup'

export const gradeSchema = yup.object().shape({
    subjectName: yup
        .string()
        .when('$mode', {
            is: 'add',
            then: (schema) => schema
                .required('Nazwa przedmiotu jest wymagana')
                .min(3, 'Nazwa przedmiotu musi mieć minimum 3 znaki')
                .max(50, 'Nazwa przedmiotu nie może przekraczać 50 znaków'),
            otherwise: (schema) => schema
                .nullable()
                .min(3, 'Nazwa przedmiotu musi mieć minimum 3 znaki')
                .max(50, 'Nazwa przedmiotu nie może przekraczać 50 znaków')
        }),
    grade: yup
        .number()
        .when('$mode', {
            is: 'add',
            then: (schema) => schema
                .required('Ocena jest wymagana')
                .typeError('Ocena jest wymagana')
                .min(2, 'Ocena musi być w zakresie 2 - 5')
                .max(5, 'Ocena musi być w zakresie 2 - 5'),
            otherwise: (schema) => schema
                .nullable()
                .typeError('Ocena jest wymagana')
                .transform((value) => (value === '' ? null : value))
                .min(2, 'Ocena musi być w zakresie 2 - 5')
                .max(5, 'Ocena musi być w zakresie 2 - 5')
        }),
    comment: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .max(200, 'Komentarz nie może przekraczać 200 znaków'),
    userId: yup
        .mixed()
        .when('$mode', {
            is: 'add',
            then: (schema) => schema
                .required('Wybierz ucznia')
                .transform((value) => {
                    if (value === '') return undefined;
                    const num = Number(value);
                    return isNaN(num) ? undefined : num;
                })
                .test('is-valid-id', 'Wybierz ucznia', value => value !== undefined && value > 0),
            otherwise: (schema) => schema
                .nullable()
                .transform((value) => {
                    if (value === '') return null;
                    const num = Number(value);
                    return isNaN(num) ? null : num;
                })
        })
});