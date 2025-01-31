import * as yup from 'yup'

export const eventSchema = yup.object().shape({
    title: yup
        .string()
        .required('Tytuł jest wymagany')
        .trim()
        .min(3, 'Tytuł musi mieć co najmniej 3 znaki')
        .max(50, 'Tytuł nie może przekraczać 50 znaków'),

    description: yup
        .string()
        .nullable()
        .transform((value) => (!value ? null : value.trim()))
        .max(200, 'Opis nie może przekraczać 200 znaków'),

    start: yup
        .date()
        .required('Data rozpoczęcia jest wymagana')
        .transform((value) => {
            if (value) {
                const date = new Date(value);
                // Reset time to start of day for consistent comparison
                date.setHours(0, 0, 0, 0);
                return date;
            }
            return value;
        })
        .test('future', 'Data rozpoczęcia musi być w przyszłości', function(value) {
            if (!value) return true;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get tomorrow's date for comparison
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            return value >= tomorrow;
        }),

    end: yup
        .date()
        .required('Data zakończenia jest wymagana')
        .transform((value) => {
            if (value) {
                const date = new Date(value);
                date.setHours(0, 0, 0, 0);
                return date;
            }
            return value;
        })
        .test('after-start', 'Data zakończenia musi być późniejsza niż data rozpoczęcia', function(value) {
            if (!value || !this.parent.start) return true;
            return value > this.parent.start;
        }),

    teamId: yup
        .string()
        .test('is-number', 'Wybierz zespół', (value) => {
            if (!value) return false;
            const num = Number(value);
            return !isNaN(num) && num > 0;
        })
        .required('Wybierz zespół')
});