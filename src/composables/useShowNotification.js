import {useToast} from "vue-toastification";

const toast = useToast();



export function useShowNotification() {
    const showNotification = (message, type = 'success') => {
        console.log(`${type}: ${message}`)
        toast(message, {type})
    }

    return {showNotification}
}