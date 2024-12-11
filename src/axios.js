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

