<script setup>
import { useForm } from 'vee-validate';
import { teamValidationSchema } from '@/validation/teamValidation';
import { teamService } from '@/services/teamService';
import { useToast } from 'vue-toastification';

const emit = defineEmits(['close', 'team-created']);
const toast = useToast();

const { handleSubmit, errors, values, setFieldValue } = useForm({
  validationSchema: teamValidationSchema,
  initialValues: {
    teamName: '',
    description: ''
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await teamService.createTeam(values);
    toast.success('Zespoł utworzony pomyślnie');
    emit('team-created');
    emit('close');
  } catch (error) {
    toast.error('Błąd podczas tworzenia zespołu');
    console.error('Error:', error);
  }
});
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-lg mx-4">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Stwórz nowy zespół</h2>
      </div>

      <form @submit.prevent="onSubmit" class="p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nazwa zespołu
            </label>
            <input
                type="text"
                :value="values.teamName"
                @input="e => setFieldValue('teamName', e.target.value)"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p v-if="errors.teamName" class="mt-1 text-sm text-red-600">
              {{ errors.teamName }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Opis (opcjonalne)
            </label>
            <textarea
                :value="values.description"
                @input="e => setFieldValue('description', e.target.value)"
                rows="4"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Stwórz zespół
          </button>
        </div>
      </form>
    </div>
  </div>
</template>