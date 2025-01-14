<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import BackButton from '@/components/ui/TextButton.vue';
import api from '@/config/axiosConfig.js';
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const currentUserId = computed(() => authStore.userId);

const users = ref([]);
const selectedUsers = ref([]);
const isSaving = ref(false);

const validationSchema = yup.object({
    teamName: yup.string()
        .required('Nazwa zespołu jest wymagana')
        .min(3, 'Nazwa zespołu musi mieć co najmniej 3 znaki')
        .max(50, 'Nazwa zespołu nie może przekraczać 50 znaków'),
    description: yup.string()
        .max(200, 'Opis zespołu nie może przekraczać 200 znaków')
});

const initialValues = {
    teamName: '',
    description: '',
    users: []
};

const { handleSubmit, errors, setFieldValue, validateField } = useForm({
    validationSchema,
    initialValues
});

const formData = ref({
    teamName: '',
    description: '',
    users: []
});

const toggleUser = (userId) => {
    const index = selectedUsers.value.indexOf(userId);
    if (index === -1) {
        selectedUsers.value.push(userId);
    } else {
        selectedUsers.value.splice(index, 1);
    }
    formData.value.users = selectedUsers.value;
    setFieldValue('users', selectedUsers.value);
};

const updateField = async (fieldName, value) => {
    formData.value[fieldName] = value;
    await setFieldValue(fieldName, value);
    await validateField(fieldName);
};

onMounted(async () => {
    try {
        if (!currentUserId.value) {
            toast.error('Użytkownik nie jest zalogowany');
            router.push('/login');
            return;
        }

        const response = await api.get('/user');
        // Filtrujemy aby pokazać tylko innych użytkowników
        users.value = response.data.filter(user => 
            String(user.id) !== String(currentUserId.value)
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

    isSaving.value = true;
    try {
        const response = await api.post('/team', {
            teamName: values.teamName,
            description: values.description,
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

                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Wybierz członków zespołu (opcjonalne)
                        </label>
                        <div class="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                            <div
                                v-for="user in users"
                                :key="user.id"
                                class="flex items-center p-2 hover:bg-gray-50 rounded"
                            >
                                <input
                                    type="checkbox"
                                    :id="'user-' + user.id"
                                    :checked="selectedUsers.includes(user.id)"
                                    @change="toggleUser(user.id)"
                                    class="mr-3 h-4 w-4 cursor-pointer"
                                />
                                <label
                                    :for="'user-' + user.id"
                                    class="flex-grow cursor-pointer"
                                >
                                    {{ user.firstName }} {{ user.lastName }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="teamName" class="block text-gray-700 text-sm font-bold mb-2">
                            Nazwa zespołu
                        </label>
                        <input
                            id="teamName"
                            :value="formData.teamName"
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
                            :value="formData.description"
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
                        class="w-full bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        {{ isSaving ? 'Tworzenie...' : 'Zapisz zespół' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>