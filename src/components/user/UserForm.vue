<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { userSchema } from '@/validation/userValidation'
import { computed, ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      group: ''
    })
  }
})

const emit = defineEmits(['submit', 'cancel'])
const isSubmitting = ref(false)

const initialValues = computed(() => ({
  email: props.user.email || '',
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  role: props.user.role || '',
  group: props.user.group || ''
}))

const handleSubmit = async (values, { resetForm }) => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    emit('submit', values, {
      onSuccess: () => {
        resetForm()
      },
      onError: () => {
        isSubmitting.value = false
      }
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    isSubmitting.value = false
  }
}
</script>

<template>
  <Form
      @submit="handleSubmit"
      :validation-schema="userSchema"
      :initial-values="initialValues"
      v-slot="{ errors, resetForm }"
      class="space-y-4"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <Field
          name="email"
          type="email"
          class="mt-1 block w-full rounded-md border-gray-300 bg-elementLight focus:border-appBg focus:ring-appBg"
          :class="{ 'border-red-500': errors.email }"
      />
      <ErrorMessage name="email" class="text-sm text-red-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Imię</label>
      <Field
          name="firstName"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 bg-elementLight shadow-sm focus:border-appBg focus:ring-appBg"
          :class="{ 'border-red-500': errors.firstName }"
      />
      <ErrorMessage name="firstName" class="text-sm text-red-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Nazwisko</label>
      <Field
          name="lastName"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 bg-elementLight shadow-sm focus:border-appBg focus:ring-appBg"
          :class="{ 'border-red-500': errors.lastName }"
      />
      <ErrorMessage name="lastName" class="text-sm text-red-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Rola</label>
      <Field
          name="role"
          as="select"
          class="mt-1 block w-full rounded-md border-gray-300 bg-elementLight shadow-sm focus:border-appBg focus:ring-appBg"
          :class="{ 'border-red-500': errors.role }"
      >
        <option value="">Wybierz rolę</option>
        <option value="ROLE_STUDENT">Student</option>
        <option value="ROLE_LECTURER">Wykładowca</option>
        <option value="ROLE_ADMIN">Administrator</option>
      </Field>
      <ErrorMessage name="role" class="text-sm text-red-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Grupa</label>
      <Field
          name="group"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 bg-elementLight shadow-sm focus:border-appBg focus:ring-appBg"
          :class="{ 'border-red-500': errors.group }"
      />
      <ErrorMessage name="group" class="text-sm text-red-500" />
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <button
          type="button"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anuluj
      </button>
      <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-saveButton text-white rounded-md text-sm font-medium hover:bg-saveButtonHover disabled:bg-gray-400 disabled:cursor-not-allowed"
          :class="{ 'opacity-50': isSubmitting }"
      >
        <span v-if="isSubmitting">
          <i class="pi pi-spinner animate-spin mr-2"></i>
          Zapisywanie...
        </span>
        <span v-else>
          {{ user.userId ? 'Zapisz' : 'Stwórz' }}
        </span>
      </button>
    </div>
  </Form>
</template>