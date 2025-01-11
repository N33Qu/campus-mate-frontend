import * as yup from 'yup';
export const passwordSchema = yup.object({
    currentPassword: yup.string()
        .required('Bieżące hasło jest wymagane')
        .min(8, 'Bieżące hasło musi mieć co najmniej 8 znaków'),
    newPassword: yup
        .string()
        .required('Hasło jest wymagane')
        .min(8, 'Hasło musi mieć co najmniej 8 znaków')
        .matches(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
        .matches(/[A-Z]/, 'Hasło musi zawierać co najmniej jednego wielkiej litery')
        .matches(/[a-z]/, 'Hasło musi zawierać co najmniej jedneą małą literę')
        .matches(/[^A-Za-z0-9]/, 'Hasło musi zawierać co najmniej jeden znak specjalny')
        .notOneOf([yup.ref('currentPassword')], 'Nowe hasło nie może być takie samo jak bieżące'),
    confirmPassword: yup.string()
        .required('Potwierdzenie hasła jest wymagane')
        .oneOf([yup.ref('newPassword')], 'Hasła nie zgadzają sie'),
});