import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('../views/NotFound.vue')
        }
    ]

});

export default router;