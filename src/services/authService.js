import { ref } from 'vue';
import api from '@/config/axiosConfig.js';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

export const useAuthValidation = () => {
    const validationSchema = yup.object({
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

    return {
        validationSchema
    };
};

export function useLoginForm() {
    const { validationSchema } = useAuthValidation();
    const { login } = useAuth();

    const showPassword = ref(false);

    const { handleSubmit, errors, defineField } = useForm({
        validationSchema
    });

    const [email, emailProps] = defineField('email');
    const [password, passwordProps] = defineField('password');

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };

    const onSubmit = handleSubmit(async (values) => {
        try {
            await login({
                email: values.email,
                password: values.password,
            });
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    return {
        email,
        emailProps,
        password,
        passwordProps,
        showPassword,
        errors,
        togglePasswordVisibility,
        onSubmit
    };
}

export function useAuth() {
    const authStore = useAuthStore();
    const toastStore = useToastStore();
    const toast = useToast();
    const isLoading = ref(false);
    const error = ref(null);

    const login = async (credentials) => {
        const { email, password } = credentials;
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            if (response.status === 200) {
                authStore.login();
                await router.push('/');
                await location.reload();
                toastStore.setToast("Zalogowano pomyślnie!", "success");
            }

            return response.data;
        } catch (err) {
            error.value = err.response?.status === 403 ? 'Złe dane logowania' : 'Błąd logowania';
            toast.error(error.value);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.post("/auth/logout");
            authStore.logout();
            await router.push('/');
            await location.reload();
            toastStore.setToast("Wylogowano pomyślnie!", "success");
            return response.data;
        } catch (err) {
            error.value = 'Błąd wylogowania';
            toastStore.setToast('Błąd wylogowania: ' + err, "error");
            throw err;
        } finally {
            isLoading.value = false;
        }
    };


    return {
        isLoading,
        error,
        login,
        logout
    };
}