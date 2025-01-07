import {useAuth} from "@/composables/useAuth.js";
import {useForm} from "vee-validate";
import {ref} from "vue";
import {authValidationSchema} from "@/validation/authSchema.js";

export function useLoginForm() {
    const { login } = useAuth();
    const showPassword = ref(false);

    const { handleSubmit, errors, defineField } = useForm({
        validationSchema: authValidationSchema
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