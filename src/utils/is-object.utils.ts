export const isValueObject = (value: unknown) => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
};
