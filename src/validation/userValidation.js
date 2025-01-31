import * as yup from 'yup'

export const userSchema = yup.object({
    email: yup
        .string()
        .required('Email jest wymagany')
        .email('Email jest nieprawidłowy'),
    firstName: yup
        .string()
        .required('Imię jest wymagane')
        .min(2, 'Imię musi mieć co najmniej 2 znaki')
        .max(50, 'Imię nie może przekraczać 50 znaków'),
    lastName: yup
        .string()
        .required('Nazwisko jest wymagane')
        .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
        .max(50, 'Nazwisko nie może przekraczać 50 znaków'),
    role: yup
        .string()
        .required('Rola jest wymagana')
        .oneOf(['ROLE_STUDENT', 'ROLE_LECTURER', 'ROLE_ADMIN'], 'Wybrano nieprawidłową rolę'),
    group: yup
        .string()
        .nullable()
        .max(50, 'Grupa nie może przekraczać 50 znaków')
})

