import { formatCurrency } from "@/lib/utils/normalization";

export function uniqueNonEmptyValues(values: Array<string | null | undefined>): string[] {
    return Array.from(
        new Set(
            values
                .map((value) => (value ?? "").trim())
                .filter((value) => value && value !== "---"),
        ),
    ).sort((left, right) => left.localeCompare(right, "es", { sensitivity: "base" }));
}

export function uniquePriceOptions(values: Array<number | string | null | undefined>) {
    const uniquePrices = Array.from(
        new Set(
            values
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value)),
        ),
    ).sort((left, right) => left - right);

    return uniquePrices.map((value) => ({
        value: String(value),
        label: formatCurrency(value, "USD"),
    }));
}

export function matchesPriceFilter(
    value: number | string | null | undefined,
    selectedPrice: string,
): boolean {
    if (!selectedPrice) return true;
    return String(Number(value)) === selectedPrice;
}
