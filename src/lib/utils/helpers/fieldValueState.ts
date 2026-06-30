export function isEmptyFieldValue(value: string | number | null | undefined): boolean {
    return (
        value === "NaN" ||
        value === "Infinity" ||
        value === null ||
        value === undefined ||
        value === "" ||
        value === "0" ||
        value === 0
    );
}

export function getFieldValueDarkClass(value: string | number | null | undefined): string {
    return isEmptyFieldValue(value) ? "field-value-dark--invalid" : "field-value-dark";
}

export function getFieldValueLightClass(value: string | number | null | undefined): string {
    return isEmptyFieldValue(value) ? "field-value-light--invalid" : "field-value-light";
}
