import { ref, computed, watch } from 'vue'

export function useEventForm(schema) {
    const formData = ref({
        title: '',
        description: '',
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
        teamId: ''
    })

    const errors = ref({})
    const isSubmitting = ref(false)
    const isValid = ref(true)
    const debouncedValidation = ref(null)

    const validateForm = async () => {
        try {
            const validData = await schema.validate(
                {
                    ...formData.value,
                    start: new Date(formData.value.start),
                    end: new Date(formData.value.end),
                    teamId: Number(formData.value.teamId)
                },
                { abortEarly: false }
            )
            errors.value = {}
            isValid.value = true
            return validData
        } catch (validationErrors) {
            errors.value = validationErrors.inner.reduce((acc, error) => {
                acc[error.path] = error.message
                return acc
            }, {})
            isValid.value = false
            return null
        }
    }

    const watchFormChanges = computed(() => JSON.stringify(formData.value))
    watch(watchFormChanges, () => {
        clearTimeout(debouncedValidation.value)
        debouncedValidation.value = setTimeout(() => {
            validateForm()
        }, 300)
    })

    return {
        formData,
        errors,
        isSubmitting,
        isValid,
        validateForm
    }
}