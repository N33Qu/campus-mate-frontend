import * as yup from 'yup';

export const authValidationSchema = yup.object({
    email: yup
        .string()
        .required('Email jest wymagany')
        .email('Nieprawidłowy format email'),
    password: yup
        .string()
        .required('Hasło jest wymagane')
        .min(6, 'Hasło musi mieć co najmniej 6 znaków')
        .matches(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?]{6,}$',
            'Hasło musi zawierać co najmniej jedną dużą literę, małą literę, cyfrę i znak specjalny'
        )
});