// useAddressBook.js
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/axios.js';

// Shared state and utilities
const createLoadingState = () => ({
    isLoading: ref(false),
    error: ref(null),
});

const handleApiError = (error, toast, customErrorMessage) => {
    console.error(error);
    if (error.response?.status === 404) {
        toast.info("Brak wyników");
        return true;
    } else {
        toast.error(customErrorMessage || "Wystąpił błąd");
        return false;
    }
};

// Single entry operations
export function useAddressBookEntry(entryId) {
    const router = useRouter();
    const toast = useToast();
    const state = ref({
        addressBookEntry: {},
        ...createLoadingState(),
    });

    const deleteEntry = async () => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this entry?');
            if (confirm) {
                await api.delete(`/api/adressbook/entry/${entryId}`);
                toast.success('Entry Deleted Successfully');
                await router.push('/addressbook');
            }
        } catch (error) {
            handleApiError(error, toast, 'Entry Not Deleted');
        }
    };

    const fetchEntry = async () => {
        state.value.isLoading = true;
        state.value.error = null;

        try {
            const response = await api.get(`/addressbook/entries/${entryId}`);
            state.value.addressBookEntry = response.data;
        } catch (error) {
            handleApiError(error, toast, 'Error fetching entry');
        } finally {
            state.value.isLoading = false;
        }
    };

    return {
        state,
        deleteEntry,
        fetchEntry,
    };
}

// List operations
export function useAddressBookList() {
    const toast = useToast();
    const searchQuery = ref('');
    const entries = ref([]);
    const noEntriesMessage = ref('');
    const { isLoading, error } = createLoadingState();

    const fetchAllEntries = async () => {
        isLoading.value = true;
        error.value = null;
        noEntriesMessage.value = '';

        try {
            const response = await api.get('/addressBook/entries/all');
            entries.value = response.data;
        } catch (err) {
            if (handleApiError(err, toast, 'Nie udało się załadować książki adresowej')) {
                noEntriesMessage.value = 'Brak danych w książce adresowej.';
                entries.value = [];
            }
        } finally {
            isLoading.value = false;
        }
    };

    const searchEntries = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get(`/addressBook/entries/search/${searchQuery.value}`);
            entries.value = response.data;
        } catch (err) {
            handleApiError(err, toast, 'Nie udało się wyszukać wpisów');
            entries.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        searchQuery,
        entries,
        isLoading,
        error,
        noEntriesMessage,
        fetchAllEntries,
        searchEntries
    };
}

// Debounced search
export function useAddressBookSearch() {
    const toast = useToast();
    const searchQuery = ref('');
    const entries = ref([]);
    const { isLoading, error } = createLoadingState();

    const fetchEntries = async () => {
        if (!searchQuery.value.trim()) {
            entries.value = [];
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get('/address-book/search', {
                params: { query: searchQuery.value }
            });
            entries.value = response.data;
        } catch (err) {
            handleApiError(err, toast, 'Nie udało się załadować książki adresowej');
            entries.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    watch(searchQuery, () => {
        const timeoutId = setTimeout(fetchEntries, 500);
        return () => clearTimeout(timeoutId);
    });

    return {
        searchQuery,
        entries,
        isLoading,
        error,
        fetchEntries
    };
}