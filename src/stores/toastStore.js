import {createPinia, defineStore, getActivePinia, setActivePinia} from 'pinia';

if (!getActivePinia()) {
    const pinia = createPinia();
    setActivePinia(pinia);
}

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
