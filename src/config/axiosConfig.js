import axios from "axios";
const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
import {setupAuthInterceptor} from "@/config/authInterceptorConfig.js";


const api =  axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

setupAuthInterceptor(api);

export default api;