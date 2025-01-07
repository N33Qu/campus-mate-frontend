export const usePhoneValidation = () => {
    const phoneRegex = /^[0-9+\s-]{9,15}$/;

    const validatePhoneNumber = (number) => {
        if (!number) return true;
        return phoneRegex.test(number) ? true : 'Nieprawidłowy format numeru telefonu';
    };

    return { validatePhoneNumber };
};