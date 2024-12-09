<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const formErrors = ref({
  name: false,
  email: false,
  message: false
})

const isValidEmail = (emailString) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailString)
}

const validateForm = () => {
  formErrors.value = {
    name: name.value.trim() === '',
    email: !isValidEmail(email.value),
    message: message.value.trim() === ''
  }

  return !Object.values(formErrors.value).some(error => error)
}

const openEmailClient = () => {
  if (!validateForm()) {
    return
  }

  const recipient = 'contact@example.com'
  const subject = encodeURIComponent(`Adresat: ${name.value}`)
  const body = encodeURIComponent(
      `Imię: ${name.value}\n` +
      `Email: ${email.value}\n\n` +
      `Wiadomość:\n${message.value}`
  )

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
}
</script>

<template>
  <div class="min-h-screen bg-appBg py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xl mx-auto bg-elementLight rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-8 text-center text-headerText">
        Skontaktuj się
      </h1>

      <form @submit.prevent="openEmailClient" class="space-y-6">
        <div>
          <label
              for="name"
              class="block mb-2"
              :class="formErrors.name ? 'text-red-600' : 'text-gray-700'"
          >
            Imie i Nazwisko *
          </label>
          <input
              id="name"
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
              :class="formErrors.name
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:border-[#4e4945]'"
          />
          <p
              v-if="formErrors.name"
              class="text-red-500 text-sm mt-1"
          >
           Podaj swoje dane
          </p>
        </div>

        <div>
          <label
              for="email"
              class="block mb-2"
              :class="formErrors.email ? 'text-red-600' : 'text-gray-700'"
          >
            Twój Email *
          </label>
          <input
              id="email"
              v-model="email"
              type="email"
              class="w-full px-3 py-2 border rounded-lg"
              :class="formErrors.email
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:border-headerText'"
          />
          <p
              v-if="formErrors.email"
              class="text-red-500 text-sm mt-1"
          >
            Podaj poprawny email
          </p>
        </div>

        <div>
          <label
              for="message"
              class="block mb-2"
              :class="formErrors.message ? 'text-red-600' : 'text-gray-700'"
          >
            Wiadomość *
          </label>
          <textarea
              id="message"
              v-model="message"
              rows="5"
              class="w-full px-3 py-2 border rounded-lg"
              :class="formErrors.message
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:border-headerText'"
          ></textarea>
          <p
              v-if="formErrors.message"
              class="text-red-500 text-sm mt-1"
          >
            Wpisz treść wiadomości
          </p>
        </div>

        <div>
          <button
              type="submit"
              class="w-full py-3 rounded-lg text-white transition-colors bg-headerText"
          >
            Wyślij email
          </button>
        </div>
      </form>
    </div>
  </div>
</template>