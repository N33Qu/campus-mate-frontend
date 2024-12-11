<script setup>
import { ref, onMounted } from 'vue';
import api from '@/axios.js';
import SearchBar from '@/components/SearchBar.vue';
import AddressBookList from '@/components/addressBook/AddressBookList.vue';
import { useToast } from 'vue-toastification'; // Zakładam, że masz toast w projekcie

const toast = useToast();

// Stan
const searchQuery = ref('');
const entries = ref([]);
const isLoading = ref(false);
const error = ref(null);
const noEntriesMessage = ref(''); // Komunikat o braku danych

// Funkcja do pobierania wszystkich wpisów
const fetchAllEntries = async () => {
  isLoading.value = true;
  error.value = null;
  noEntriesMessage.value = '';

  try {
    const response = await api.get('/addressBook/entries/all');
      entries.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      noEntriesMessage.value = 'Brak danych w książce adresowej.';
      entries.value = [];
    } else {
      error.value = 'Nie udało się załadować książki adresowej';
      console.error(err);
    }
  } finally {
    isLoading.value = false;
  }
};

// Funkcja do wyszukiwania wpisów
const searchEntries = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/addressBook/entries/search/${searchQuery.value}`);
    entries.value = response.data;

  } catch (err) {
    if (err.response && err.response.status === 404) {
      toast.info("Brak wyników wyszukiwania");
    } else {
      toast.error("Błąd podczas wyszukiwania");
      error.value = 'Nie udało się wyszukać wpisów';
    }
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Pobieranie wszystkich wpisów na początku
onMounted(fetchAllEntries);
</script>

<template>
  <div class="min-h-screen bg-appBg p-6">
    <div class="max-w-4xl mx-auto bg-stone-50 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center py-6 text-headerText">
        Książka adresowa
      </h1>

      <!-- Pasek wyszukiwania -->
      <div class="flex flex-wrap items-center gap-4 p-6">
        <div class="flex-1">
          <SearchBar
              v-model="searchQuery"
              placeholder="Szukaj po imieniu i nazwisku"
          />
        </div>
        <button
            class="px-4 py-2 bg-button text-white rounded shadow hover:bg-buttonHover"
            @click="searchEntries"
        >
          Szukaj
        </button>
      </div>

      <!-- Stan ładowania -->
      <div v-if="isLoading" class="text-center py-6">
        Ładowanie...
      </div>

      <!-- Komunikat o błędzie -->
      <div v-else-if="error" class="text-red-500 text-center py-6">
        {{ error }}
      </div>

      <!-- Komunikat o braku danych -->
      <div v-else-if="noEntriesMessage" class="text-center py-6 text-gray-500">
        {{ noEntriesMessage }}
      </div>

      <!-- Lista wpisów -->
      <AddressBookList
          v-else-if="entries.length"
          :entries="entries"
      />

      <!-- Domyślny komunikat -->
      <div v-else class="text-center py-6">
        {{ searchQuery.trim() ? 'Brak wyników wyszukiwania' : 'Wprowadź imię lub nazwisko, aby wyszukać' }}
      </div>
    </div>
  </div>
</template>
