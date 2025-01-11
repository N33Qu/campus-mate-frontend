import * as yup from 'yup';

export const profileSchema = yup.object({
    firstName: yup.string()
        .required('Imię jest wymagane')
        .min(2, 'Imię musi mieć co najmniej 2 znaki')
        .max(50, 'Imię nie może przekraczać 50 znaków'),
    lastName: yup.string()
        .required('Nazwisko jest wymagane')
        .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
        .max(50, 'Nazwisko nie może przekraczać 50 znaków'),
});