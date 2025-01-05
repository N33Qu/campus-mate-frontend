import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        //AddressBook Routes
        {
            path: '/addressbook',
            name: 'addressbook',
            component: () => import('@/views/addressbook/AddressBookView.vue'),
        },
        {
            path: '/addressbook/entry/:id',
            name: 'addressbook-entry',
            component: () => import('@/views/addressbook/AddressBookEntryView.vue'),
        },
        {
            path: '/addressbook/edit/:id',
            name: 'edit-addressbook',
            component: () => import('@/views/addressbook/EditAddressBookView.vue'),
        },
        //Calendar Routes
        {
            path: '/calendar',
            name: 'calendar',
            component: () => import('@/views/calendar/CalendarView.vue'),
        },
        {
            path: '/calendar/edit/:id',
            name: 'edit-calendar',
            component: () => import('@/views/calendar/EditCalendarView.vue'),
        },
        //Events Routes
        {
            path: '/events/:id',
            name: 'event',
            component: () => import('@/views/event/EventView.vue'),
        },
        {
            path: '/events/edit/:id',
            name: 'edit-event',
            component: () => import('@/views/event/EditEventView.vue'),
        },
        {
            path: '/events/add',
            name: 'add-event',
            component: () => import('@/views/event/AddEventView.vue'),
        },
        //Grade Routes
        {
            path: '/grades',
            name: 'grades',
            component: () => import('@/views/grade/GradesView.vue'),
        },
        // {
        //     path: '/grades/edit/:id',
        //     name: 'edit-grade',
        //     component: () => import('@/views/grade/EditGradeView.vue'),
        // },
        // {
        //     path: '/grades/add',
        //     name: 'add-grade',
        //     component: () => import('@/views/grade/AddGradeView.vue'),
        // },
        {
            path: '/grades/:id',
            name: 'grade',
            component: () => import('@/views/grade/GradeView.vue'),
        },
        //Posts Routes
        {
            path: '/posts',
            name: 'posts',
            component: () => import('@/views/post/PostsView.vue'),
        },
        {
            path: '/posts/:id',
            name: 'post',
            component: () => import('@/views/post/PostView.vue'),
        },
        {
            path: '/posts/add',
            name: 'add-post',
            component: () => import('@/views/post/AddPostView.vue'),
        },
        {
            path: '/posts/edit/:id',
            name: 'edit-post',
            component: () => import('@/views/post/EditPostView.vue'),
        },
        //Schedule Routes
        {
            path: '/schedule',
            name: 'schedule',
            component: () => import('@/views/schedule/ScheduleView.vue'),
        },
        //Teams Routes
        {
            path: '/teams',
            name: 'teams',
            component: () => import('@/views/team/TeamsView.vue'),
        },
        {
            path: '/teams/add',
            name: 'add-teams',
            component: () => import('@/views/team/AddTeamsView.vue'),
        },
        {
            path: '/teams/:id',
            name: 'team',
            component: () => import('@/views/team/TeamView.vue'),
        },
        {
            path: '/teams/edit/:id',
            name: 'edit-teams',
            component: () => import('@/views/team/EditTeamsView.vue'),
        },
        {
            path: '/teams/add-users',
            name: 'add-users-to-team',
            component: () => import('@/views/team/AddUsersToTeamView.vue'),
        },
        //Users Routes
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/user/UsersView.vue'),
        },
        {
            path: '/users/:id',
            name: 'user',
            component: () => import('@/views/user/UserView.vue'),
        },
        {
            path: '/users/edit/:id',
            name: 'edit-user',
            component: () => import('@/views/user/EditUserView.vue'),
        },
        {
            path: '/users/add',
            name: 'add-user',
            component: () => import('@/views/user/AddUserView.vue'),
        },
        //Auth Routes
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
        //Static: About, Contact, FAQ
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
        //404
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: () => import('@/views/static/NotFoundView.vue'),
        },

    ]

});

export default router;