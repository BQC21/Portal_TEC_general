import { createClient } from "@/lib/supabase/client";
import { ProductFormData } from "@/lib/types/product-types";

export const PRODUCTS_TABLE = "productos";

// --------------------------
// ---- Tolerancias de nomenclatura para el atributo de fuente de divisas
// --------------------------

export const CURRENCY_COLUMN_CANDIDATES = [
    "priceInputCurrency",
    "price_input_currency",
    "fuente_divisas",
    "fuente_divisa",
    "currency_source",
    "moneda",
] as const;

let cachedCurrencyColumnName: string | null | undefined; // memoria caché de la columna asociada a la fuente de divisas

export async function resolveCurrencyColumnName(supabase: ReturnType<typeof createClient>): Promise<string | null> {
    if (cachedCurrencyColumnName !== undefined) {
    return cachedCurrencyColumnName;
    }

    for (const columnName of CURRENCY_COLUMN_CANDIDATES) {
        const { error } = await supabase
            .from(PRODUCTS_TABLE)
            .select(columnName)
            .limit(1);

        if (!error) {
            cachedCurrencyColumnName = columnName;
            return columnName;
        }
    }

    cachedCurrencyColumnName = null;
    return null;
}

// --------------------------
// ---- Añadir la fuente de divisa
// --------------------------
export async function addCurrencyToRow(
    supabase: ReturnType<typeof createClient>,
    row: Record<string, unknown>,
    currency: ProductFormData["priceInputCurrency"]
): Promise<Record<string, unknown>> {
    const currencyColumnName = await resolveCurrencyColumnName(supabase);

    if (!currencyColumnName) {
        return row;
    }

    return {
        ...row,
        [currencyColumnName]: currency,
    };
}