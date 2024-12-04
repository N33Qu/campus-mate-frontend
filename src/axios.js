import axios from "axios";

const api =  axios.create({
    baseURL: "http://localhost:8080/api",
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
    } catch (error) {
        console.error("Error logging in:", error);
    }
}