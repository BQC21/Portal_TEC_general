const DASHES = "- - -";

export function isBlankCatalogValue(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "number") return !Number.isFinite(value) || value === 0;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === "0") return true;
        const numeric = Number(trimmed);
        return Number.isFinite(numeric) && numeric === 0 && trimmed !== "";
    }
    return false;
}

export function displayCatalogCell(value: unknown): string {
    return isBlankCatalogValue(value) ? DASHES : String(value);
}

export function displayCatalogNumber(value: unknown, digits: number): string {
    if (isBlankCatalogValue(value)) return DASHES;
    const numeric = typeof value === "number" ? value : Number(value);
    return numeric.toFixed(digits);
}

export function displayExchangeRate(soles: unknown, dolares: unknown): string {
    const pen = Number(soles);
    const usd = Number(dolares);
    if (!Number.isFinite(pen) || !Number.isFinite(usd) || pen === 0 || usd === 0) return DASHES;
    return (pen / usd).toFixed(3);
}
