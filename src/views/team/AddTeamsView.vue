<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import BackButton from '@/components/ui/TextButton.vue';
import api from '@/config/axiosConfig.js';
import { useAuthStore } from '@/stores/authStore.js';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const currentUserId = computed(() => authStore.userId);
const users = ref([]);
const selectedUsers = ref([]);
const isSaving = ref(false);
const searchQuery = ref('');

const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase()) &&
               user.role === 'ROLE_STUDENT';
    });
});

const validationSchema = yup.object({
    teamName: yup.string()
        .required('Nazwa zespołu jest wymagana')
        .min(3, 'Nazwa zespołu musi mieć co najmniej 3 znaki')
        .max(50, 'Nazwa zespołu nie może przekraczać 50 znaków'),
    description: yup.string()
        .max(200, 'Opis zespołu nie może przekraczać 200 znaków'),
    users: yup.array()
        .of(yup.number())
});

const { handleSubmit, errors, setFieldValue, values } = useForm({
    validationSchema,
    initialValues: {
        teamName: '',
        description: '',
        users: []
    }
});

const isSelected = (userId) => {
    return selectedUsers.value.includes(userId);
};

const toggleUser = async (userId) => {
    const index = selectedUsers.value.indexOf(userId);
    if (index === -1) {
        selectedUsers.value.push(userId);
    } else {
        selectedUsers.value.splice(index, 1);
    }
    await setFieldValue('users', selectedUsers.value);
};

onMounted(async () => {
    try {
        if (!currentUserId.value) {
            toast.error('Użytkownik nie jest zalogowany');
            router.push('/login');
            return;
        }

        const response = await api.get('/user');
        users.value = response.data.filter(user => 
            String(user.id) !== String(currentUserId.value) &&
            user.role === 'ROLE_STUDENT'
        );
    } catch (error) {
        console.error('Error fetching data', error);
        toast.error('Błąd pobierania danych');
    }
});

const onSubmit = handleSubmit(async (values) => {
    if (!currentUserId.value) {
        toast.error('Użytkownik nie jest zalogowany');
        return;
    }

    if (selectedUsers.value.length === 0) {
        const confirmCreate = window.confirm('Czy na pewno chcesz utworzyć zespół bez dodawania członków?');
        if (!confirmCreate) {
            return;
        }
    }

    isSaving.value = true;
    try {
        const response = await api.post('/team', {
            teamName: values.teamName,
            description: values.description || '',
            users: selectedUsers.value,
            createdBy: currentUserId.value
        });
        toast.success('Zespół utworzony pomyślnie');
        await router.push('/teams');
    } catch (error) {
        console.error('Error creating team', error);
        toast.error('Błąd tworzenia zespołu');
    } finally {
        isSaving.value = false;
    }
});

const updateField = async (field, value) => {
    await setFieldValue(field, value);
};
</script>

<template>
    <div v-if="currentUserId" class="bg-element min-h-screen py-10">
        <div class="container mx-auto px-6">
            <BackButton :to="`/teams`" text="Powrót do Zespołów" icon="pi pi-arrow-circle-left" />

            <form @submit.prevent="onSubmit" class="max-w-2xl mx-auto">
                <div class="bg-elementLight shadow-md rounded-lg p-8">
                    <h2 class="text-2xl font-bold mb-6 text-center text-headerText">
                        Stwórz zespół
                    </h2>

                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Wybierz członków zespołu (opcjonalne)
                        </label>
                        
                        <!-- Searchbar -->
                        <div class="mb-3">
                            <div class="relative">
                                <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Wyszukaj użytkowników..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appBg focus:border-transparent"
                                />
                            </div>
                        </div>

                        <!-- Users list -->
                        <div class="border border-gray-200 rounded-lg">
                            <div class="max-h-60 overflow-y-auto overflow-x-auto custom-scrollbar">
                                <div class="min-w-full">
                                    <div
                                        v-for="user in filteredUsers"
                                        :key="user.id"
                                        class="border-b border-gray-100 last:border-b-0"
                                    >
                                        <label
                                            :for="'user-' + user.id"
                                            class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                                        >
                                            <input
                                                type="checkbox"
                                                :id="'user-' + user.id"
                                                :checked="isSelected(user.id)"
                                                @change="toggleUser(user.id)"
                                                class="mr-3 w-4 h-4 text-appBg border-gray-300 rounded focus:ring-appBg"
                                            />
                                            <span class="text-gray-700">
                                                {{ user.firstName }} {{ user.lastName }}
                                            </span>
                                        </label>
                                    </div>

                                    <!-- Empty state -->
                                    <div 
                                        v-if="filteredUsers.length === 0"
                                        class="p-4 text-center text-gray-500"
                                    >
                                        Nie znaleziono użytkowników
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Selected count -->
                        <div class="mt-2 text-sm text-gray-600">
                            Wybrano: {{ selectedUsers.length }} {{ selectedUsers.length === 1 ? 'osoba' : 'osób' }}
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="teamName" class="block text-gray-700 text-sm font-bold mb-2">
                            Nazwa zespołu
                        </label>
                        <input
                            id="teamName"
                            :value="values.teamName"
                            @input="updateField('teamName', $event.target.value)"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-appBg"
                            placeholder="Wprowadź nazwę zespołu"
                        />
                        <p v-if="errors.teamName" class="text-red-500 text-sm mt-1">
                            {{ errors.teamName }}
                        </p>
                    </div>

                    <div class="mb-6">
                        <label for="description" class="block text-gray-700 text-sm font-bold mb-2">
                            Opis zespołu
                        </label>
                        <textarea
                            id="description"
                            :value="values.description"
                            @input="updateField('description', $event.target.value)"
                            rows="8"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-appBg"
                            placeholder="Wprowadź opis zespołu"
                        ></textarea>
                        <p v-if="errors.description" class="text-red-500 text-sm mt-1">
                            {{ errors.description }}
                        </p>
                    </div>

                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="w-full bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ isSaving ? 'Tworzenie...' : 'Zapisz zespół' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-corner {
    background: #f7fafc;
}
</style>