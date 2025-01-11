import {ref, watchSyncEffect} from 'vue';
import { addressBookService } from '@/services/addressBookService.js';
import {useShowNotification} from "@/composables/useShowNotification.js";

export function useAddressBook() {
    const entries = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const selectedEntry = ref(null);
    const isEditModalOpen = ref(false);
    const isViewModalOpen = ref(false);
    const {showNotification} = useShowNotification()

    const fetchEntries = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            entries.value = await addressBookService.getAllEntries();
        } catch (err) {
            if (err.response.status === 404) {
                error.value = 'Brak wpisów w książce adresowej';
                showNotification(error.value, 'info');
            } else {
                error.value = 'Błąd pobierania wpisów';
                console.error('Error fetching entries:', err);
                showNotification(error.value, 'error');
            }
        } finally {
            isLoading.value = false;
        }
    };

    const searchEntries = async () => {
        if (!searchQuery.value.trim()) {
            await fetchEntries();
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            entries.value = await addressBookService.searchEntries(searchQuery.value);
        } catch (err) {
            error.value = err.message;
            showNotification(error.value, 'error');
        } finally {
            isLoading.value = false;
        }
    };

    const deleteEntry = async (entryId) => {
        try {
            await addressBookService.deleteEntry(entryId);
            await fetchEntries();
            showNotification('Wpis został usunięty')
            setInterval(2000)
            location.reload()

        } catch (err) {
            error.value = 'Błąd usuwania wpisu';
            showNotification(error.value, 'error');
        }
    };

    const editEntry = (entry) => {
        selectedEntry.value = entry;
        isEditModalOpen.value = true;
    };

    const updateEntry = async (updatedEntry) => {
        try {
            await addressBookService.updateEntry(updatedEntry.entryId, updatedEntry);
            isEditModalOpen.value = false;
            selectedEntry.value = null;
            await fetchEntries();
            showNotification('Wpis został zaktualizowany');
        } catch (err) {
            error.value = 'Błąd aktualizacji wpisu';
            showNotification(error.value, 'error');
        }
    };

    const viewEntry = (entry) => {
        selectedEntry.value = entry;
        isViewModalOpen.value = true;
    };


    return {
        entries,
        isLoading,
        error,
        searchQuery,
        selectedEntry,
        isEditModalOpen,
        isViewModalOpen,
        fetchEntries,
        searchEntries,
        deleteEntry,
        editEntry,
        updateEntry,
        viewEntry
    };
}