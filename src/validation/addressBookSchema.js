import * as yup from 'yup';

export const addressBookSchema = yup.object({
    contactName: yup
        .string()
        .required('Nazwa kontaktu jest wymagana')
        .min(2, 'Nazwa kontaktu musi mieć minimum 2 znaki')
        .max(100, 'Nazwa kontaktu może mieć maksymalnie 100 znaków'),

    email: yup
        .string()
        .required('Email jest wymagany')
        .email('Nieprawidłowy format adresu email'),


    phoneNumber: yup
        .string()
        .transform((value) => (!value ? null : value))
        .nullable()
        .test('phone-format', 'Nieprawidłowy format numeru telefonu', (value) => {
            if (!value) return true; // Return true if empty or null
            return /^[0-9+\s-]{9,12}$/.test(value) && value.length <= 12;
        }),

    classNumber: yup
        .string()
        .nullable()
        .max(20, 'Numer klasy może mieć maksymalnie 20 znaków'),

    notes: yup
        .string()
        .nullable()
        .max(500, 'Notatki mogą mieć maksymalnie 500 znaków')
});