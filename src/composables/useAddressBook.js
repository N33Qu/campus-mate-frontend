import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { addressBookService } from '@/services/addressBookService';

export function useAddressBook() {
    const toast = useToast();
    const entries = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const selectedEntry = ref(null);
    const isEditModalOpen = ref(false);
    const isViewModalOpen = ref(false);

    const fetchEntries = async () => {
        isLoading.value = true;
        error.value = null;

        try {
            entries.value = await addressBookService.getAllEntries();
        } catch (err) {
            if (err.response.status === 404) {
                error.value = 'Brak wpisów w książce adresowej';
            } else {
                error.value = 'Błąd pobierania wpisów';
                console.error('Error fetching entries:', err);
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
            toast.error('Brak wpisów w książce adresowej');
        } finally {
            isLoading.value = false;
        }
    };

    const deleteEntry = async (entryId) => {
        try {
            await addressBookService.deleteEntry(entryId);
            toast.success('Wpis został usunięty');
            await fetchEntries();
        } catch (err) {
            toast.error('Nie udało się usunąć wpisu');
        }
    };

    const editEntry = (entry) => {
        selectedEntry.value = entry;
        isEditModalOpen.value = true;
    };

    const updateEntry = async (updatedEntry) => {
        try {
            await addressBookService.updateEntry(updatedEntry.entryId, updatedEntry);
            toast.success('Wpis został zaktualizowany');
            isEditModalOpen.value = false;
            selectedEntry.value = null;
            await fetchEntries();
        } catch (err) {
            toast.error('Nie udało się zaktualizować wpisu');
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