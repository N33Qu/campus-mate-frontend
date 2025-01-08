import * as yup from 'yup'

export const eventSchema = yup.object().shape({
    title: yup
        .string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must not exceed 50 characters'),
    description: yup
        .string()
        .max(200, 'Description must not exceed 200 characters'),
    start: yup
        .date()
        .required('Start date is required')
        .min(new Date(), 'Start date must be in the future'),
    end: yup
        .date()
        .required('End date is required')
        .min(yup.ref('start'), 'End date must be after start date'),
    teamId: yup
        .number()
        .required('Team ID is required')
        .positive('Team ID must be a positive number')
        .integer('Team ID must be an integer')
})