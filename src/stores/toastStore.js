import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
    state: () => ({
        toast: null,
    }),
    actions: {
        setToast(message, type) {
            this.toast = { message, type };
        },
        clearToast() {
            this.toast = null;
        },
    },
    persist: true,
});
