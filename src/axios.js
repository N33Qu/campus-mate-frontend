import axios from "axios";
import {useAuthStore} from "@/stores/authStore.js";
import {setActivePinia, createPinia, getActivePinia} from 'pinia';
import router from "@/router/index.js";
import {useToastStore} from "@/stores/toastStore.js";
const toastStore = useToastStore();
const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
import {useToast} from "vue-toastification";

const toast = useToast();

if (!getActivePinia()) {
    const pinia = createPinia();
    setActivePinia(pinia);
}

const authStore = useAuthStore();

const api =  axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

export default api;

export async function login(credentials) {
    const { email, password } = credentials;
    try {
        const response = await api.post("/auth/login", {
            email,
            password
        });
        console.log(response.status);
        if (response.status === 200) {
            await router.push('/').then(() => location.reload());
            toastStore.setToast("Zalogowano pomyślnie!", "success");
        }
        console.log("Logged in successfully:", response.data);
        authStore.login();
    } catch (error) {
        console.error("Error logging in:", error);
        if (error.response.status === 403) {
            toast.error('Złe dane logowania');
        }
        else {
            toast.error('Błąd logowania');
        }

    }
}

export async function logout() {
    try {
        const response = await api.post("/auth/logout");
        console.log("Logged out successfully:", response.data);
        authStore.logout();
    } catch (error) {
        console.error("Error logging out:", error);
    }
}



