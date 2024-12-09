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
    }),
    actions: {
        login() {
            console.log('Login method called');
            this.isLoggedIn = this.isTokenValid;
            this.role = this.userRole;
            console.log('Final login state:', {
                isLoggedIn: this.isLoggedIn,
                role: this.role
            });
        },

        logout() {
            Cookies.remove('jwt');
            this.isLoggedIn = false;
            this.role = null;
        },
    },
    getters: {
        /**
         * Dynamically checks if the token is valid and the user is logged in.
         * @returns {boolean} - True if the token is valid, false otherwise.
         */
        isTokenValid() {
            const token = Cookies.get('jwt');
            console.log("isTokenValid called with token:", token);
            if (!token) return false;

            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded token:', decodedToken);
                const currentTime = Math.floor(Date.now() / 1000);
                console.log('Current time:', currentTime);
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
    },
    persist: true,
});
