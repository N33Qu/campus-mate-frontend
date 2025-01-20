import * as yup from 'yup';

export const teamValidationSchema = yup.object({
    teamName: yup.string()
        .required('Team name is required')
        .min(3, 'Team name must be at least 3 characters')
        .max(50, 'Team name cannot exceed 50 characters'),
    description: yup.string()
        .max(200, 'Description cannot exceed 200 characters'),
    users: yup.array()
        .of(yup.number())
});

export const teamSearchValidationSchema = yup.object({
    searchQuery: yup.string()
        .max(50, 'Search query cannot exceed 50 characters')
});