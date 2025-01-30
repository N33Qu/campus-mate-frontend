import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { homeTypeGuard } from "@/guards/homeTypeGuard.js";
import { useAuthStore } from "@/stores/authStore.js";

// Trasy publiczne
const publicRoutes = ['login', 'about', 'contact', 'faq', 'not-found', 'home'];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: false },
            beforeEnter: homeTypeGuard,
        },
        // AddressBook Routes
        {
            path: '/addressbook',
            name: 'addressbook',
            component: () => import('@/views/addressBook/AddressBookView.vue'),
        },
        // Calendar Routes
        {
            path: '/calendar',
            name: 'calendar',
            component: () => import('@/views/calendar/CalendarView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        // Grade Routes
        {
            path: '/grades',
            name: 'grades',
            component: () => import('@/views/grade/GradesView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        // Posts Routes
        {
            path: '/posts',
            name: 'posts',
            component: () => import('@/views/post/PostsView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        {
            path: '/posts/:id',
            name: 'post',
            component: () => import('@/views/post/PostView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        // Schedule Routes
        {
            path: '/schedule',
            name: 'schedule',
            component: () => import('@/views/schedule/ScheduleView.vue'),
            meta: {  roles: ['ROLE_STUDENT', 'ROLE_LECTURER', 'ROLE_ADMIN'] },
        },
        // Teams Routes
        {
            path: '/teams',
            name: 'teams',
            component: () => import('@/views/team/TeamsView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        {
            path: '/teams/:id',
            name: 'team',
            component: () => import('@/views/team/TeamView.vue'),
            meta: { roles: ['ROLE_STUDENT', 'ROLE_LECTURER'] },
        },
        // User Profile Route
        {
            path: '/profile/:id',
            name: 'profile',
            component: () => import('@/views/profile/UserProfileView.vue'),
        },
        // Auth Routes
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginView.vue'),
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('@/views/auth/LogoutView.vue'),
        },
        // Admin Panel Routes
        {
            path: '/adminPanel',
            name: 'adminPanel',
            component: () => import('@/views/user/UsersManagementView.vue'),
            meta: { roles: ['ROLE_ADMIN'] },
        },
        // Static: About, Contact, FAQ
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/static/AboutView.vue'),
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('@/views/static/ContactView.vue'),
        },
        {
            path: '/faq',
            name: 'faq',
            component: () => import('@/views/static/FAQView.vue'),
        },
        // 404
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: () => import('@/views/static/NotFoundView.vue'),
        },
    ]
});


router.beforeEach(async (to) => {
    const authStore = useAuthStore();


    if (publicRoutes.includes(to.name)) {
        if (to.name === 'login' && authStore.isTokenValid) {
            return { name: 'home' };
        }
        return true;
    }


    if (!authStore.isTokenValid) {
        return {
            name: 'login',
            query: { redirect: to.fullPath }
        };
    }

    if (!authStore.isFirstPasswordChanged && authStore.isTokenValid && to.name !== 'profile') {
        return {
            name: 'profile',
            params: { id: authStore.userId }
        };
    }


    if (to.meta.roles) {
        const userRole = authStore.userRole;
        if (!to.meta.roles.includes(userRole)) {
            return { name: 'home' };
        }
    }

    return true;
});

export default router;