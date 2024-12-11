import './assets/main.css'
import router from "@/router/index.js";
import { createApp } from 'vue'
import App from './App.vue'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { ScheduleXCalendar } from '@schedule-x/vue';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(router);
app.use(Toast);
app.component('ScheduleXCalendar', ScheduleXCalendar);
app.use(pinia);
app.mount('#app');
