import * as yup from 'yup'

export const eventSchema = yup.object().shape({
    title: yup
        .string()
        .required('Tytuł jest wymagany')
        .min(3, 'Tytuł musi mieć co najmniej 3 znaki')
        .max(50, 'Tytuł nie może przekraczać 50 znaków'),
    description: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .max(200, 'Opis nie może przekraczać 200 znaków'),
    start: yup
        .date()
        .required('Data rozpoczęcia jest wymagana')
        .min(new Date(), 'Data rozpoczęcia musi być w przyszłości'),

    end: yup
        .date()
        .required('Data zakonczenia jest wymagana')
        .min(yup.ref('start'), 'Data zakonczeńia musi być po dacie rozpoczęcia'),

    teamId: yup
        .number()
        .when('$mode', {
            is: 'add',
            then: (schema) => schema
                .required('Id zespołu jest wymagane')
                .positive('Id zespołu musi być dodatnie')
                .integer('Id zespołu musi być liczbą całkowita')
                .nonNullable('Id zespołu jest wymagane')
                .typeError('Id zespołu musi być liczbą'),
            otherwise: (schema) => schema
                .nullable()
                .transform((value) => (value === '' ? null : value))
        })
})