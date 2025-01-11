import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

import {setActivePinia, createPinia, getActivePinia} from 'pinia';

if (!getActivePinia()) {
    const pinia = createPinia();
    setActivePinia(pinia);
}


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        role: null,
        id: null,
    }),
    actions: {
        login() {
            this.isLoggedIn = this.isTokenValid;
            this.role = this.userRole;
            this.id = this.userId;
        },

        logout() {
            this.isLoggedIn = this.isTokenValid;
            this.role = this.userRole;
            this.id = this.userId;
        },
    },
    getters: {
        /**
         * Dynamically checks if the token is valid and the user is logged in.
         * @returns {boolean} - True if the token is valid, false otherwise.
         */
        isTokenValid() {
            const token = Cookies.get('jwt');
            if (!token) return false;

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);
                return decodedToken.exp && decodedToken.exp > currentTime;
            } catch (error) {
                console.error('Error decoding token:', error);
                return false;
            }
        },
        /**
         * Checks the user's role from the token if the token is valid.
         * @returns {string|null} - The user's role, or null if the token is invalid or missing.
         */
        userRole() {
            if (!this.isTokenValid) return null;

            try {
                const token = Cookies.get('jwt');
                const decodedToken = jwtDecode(token);
                return decodedToken.role || null;
            } catch (error) {
                console.error('Error retrieving role from JWT:', error);
                return null;
            }
        },

        /**
         * Checks the user's role from the token if the token is valid.
         * @returns {string|null} - The user's role, or null if the token is invalid or missing.
         */
        userId() {

            if (!this.isTokenValid) return null;

            try {
                const token = Cookies.get('jwt');
                const decodedToken = jwtDecode(token);
                return decodedToken.userId || null;
            } catch (error) {
                console.error('Error retrieving user ID from JWT:', error);
                return null;
            }
        },
    },
    persist: true,
});
