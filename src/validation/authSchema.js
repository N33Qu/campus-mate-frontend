import * as yup from 'yup';

export const authValidationSchema = yup.object({
    email: yup
        .string()
        .required('Email jest wymagany')
        .email('Nieprawidłowy format email'),
    password: yup
        .string()
        .required('Hasło jest wymagane')
        .min(8, 'Hasło musi mieć co najmniej 8 znaków')
        .matches(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
        .matches(/[A-Z]/, 'Hasło musi zawierać co najmniej jednego wielkiej litery')
        .matches(/[a-z]/, 'Hasło musi zawierać co najmniej jedneą małą literę')
        .matches(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny'),
});