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

export async function fetchEvents(){
    try {
        const response = await api.get("/events");
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

export async function addEvent(eventData) {
    try {
        const response = await api.post("/events", eventData);
        return response.data;
    } catch (error) {
        console.error("Error adding event:", error);
    }
}

export async function updateEvent(eventId, eventData) {
    try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        console.error("Error updating event:", error);
    }
}

export async function deleteEvent(eventId) {
    try {
        const response = await api.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
    }
}

export async function fetchGrades(){
    try {
        const response = await api.get("/grades");
        return response.data.map((gradeDto) => ({
            subjectName: gradeDto.subjectName,
            grade: gradeDto.grade,
            comment: gradeDto.comment,
            dateOfReceipt: new Date(gradeDto.dateOfReceipt)
        }));
    } catch (error) {
        console.error("Error fetching grades:", error);
        throw error;
    }
}

export async function addGrade(gradeData){
    try {
        const response = await api.post("/grades", {
            subjectName: gradeData.subjectName,
            grade: gradeData.grade,
            comment: gradeData.comment
        });

        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error adding grade:", error);
        throw error;
    }
}

export async function updateGrade(gradeId, gradeData){
    try {
        const response = await api.put(`/grades/${gradeId}`, gradeData);

        return {
            ...gradeData,
            dateOfReceipt: new Date(response.data.dateOfReceipt)
        };
    } catch (error) {
        console.error("Error updating grade:", error);
        throw error;
    }
}

export async function deleteGrade(gradeId){
    try {
        await api.delete(`/grades/${gradeId}`);
    } catch (error) {
        console.error("Error deleting grade:", error);
        throw error;
    }
}
