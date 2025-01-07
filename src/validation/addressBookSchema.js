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
        .nullable()
        .max(12, 'Numer telefonu może mieć maksymalnie 12 znaków'),

    classNumber: yup
        .string()
        .nullable()
        .max(20, 'Numer klasy może mieć maksymalnie 20 znaków'),

    notes: yup
        .string()
        .nullable()
        .max(500, 'Notatki mogą mieć maksymalnie 500 znaków')
});