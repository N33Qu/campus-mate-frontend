import axios from "axios";
import {useAuthStore} from "@/stores/authStore.js";
import {setActivePinia, createPinia, getActivePinia} from 'pinia';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;

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
        const response = await api.post("/auth/authenticate", {
            email,
            password
        });
        console.log("Logged in successfully:", response.data);
        authStore.login()
    } catch (error) {
        console.error("Error logging in:", error);
    }
}

export async function logout() {
    try {
        const response = await api.post("/auth/logout");
        console.log("Logged out successfully:", response.data);
        authStore.logout()
    } catch (error) {
        console.error("Error logging out:", error);
    }
}