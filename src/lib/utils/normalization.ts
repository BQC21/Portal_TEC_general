import {CurrencyCode, PRICE_CURRENCY_OPTIONS} from "@/lib/utils/options"

// -------------------------
// Funciones para Normalización y Formateo de Datos
// -------------------------

// función para convertir un valor a número de forma segura
export function toSafeNumber(value: unknown): number {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : 0;
	}

	if (value === null || value === undefined) return 0;

	let s = String(value).trim();
	if (s === "") return 0;

	// Remove common currency symbols and whitespace
	s = s.replace(/[\s\$/S€£¥¢₱₲]/g, "");

	// If value contains a slash (e.g. "20/20"), take the first segment
	if (s.includes("/")) {
		s = s.split("/")[0];
	}

	// Handle comma as decimal separator. If both '.' and ',' exist, assume ',' are thousand separators.
	if (s.includes(",")) {
		if (s.includes(".")) {
			s = s.replace(/,/g, "");
		} else {
			s = s.replace(/,/g, ".");
		}
	}

	// Extract the first numeric-like substring
	const m = s.match(/-?\d+(?:\.\d+)?/);
	const parsed = m ? Number(m[0]) : Number.NaN;

	if (!Number.isFinite(parsed)) return 0;

	// Prevent numeric field overflow by capping excessively large values
	const MAX_SAFE_UPLOAD_NUMBER = 1_000_000_000; // 1 billion
	if (Math.abs(parsed) > MAX_SAFE_UPLOAD_NUMBER) {
		// Keep a bounded value instead of letting DB error on insert
		console.warn(`toSafeNumber: value '${String(value)}' parsed as ${parsed} 
			exceeds max ${MAX_SAFE_UPLOAD_NUMBER}, capping.`);
		return Math.sign(parsed) * MAX_SAFE_UPLOAD_NUMBER;
	}

	return parsed;
}

// función para normalizar el código de moneda, 
export function normalizeCurrencyCode(value: unknown): CurrencyCode {
	if ((PRICE_CURRENCY_OPTIONS as readonly string[]).includes(String(value))) {
		return value as CurrencyCode;
	}
	return "PEN";
}

// ---- Formateo de números
export const parseNumber = (v: unknown): number | undefined => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    const s = String(v).trim();
    if (s === "") return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
};

// Parsear números enteros (undefined -> null)
export function toNullableInteger(value: unknown): number | null {
    const parsed = parseNumber(value);
    return parsed === undefined ? null : parsed;
}

// ---------
// ARREGLOS
// ---------

// normalizar arreglo de strings
export function normalizeAssociationIds(ids: unknown, fallbackId?: unknown): string[] {
    const fromArray = Array.isArray(ids)
        ? ids.map((id) => String(id ?? "").trim()).filter(Boolean)
        : [];
    if (fromArray.length > 0) {
        return Array.from(new Set(fromArray));
    }
    const fallback = String(fallbackId ?? "").trim();
    return fallback ? [fallback] : [];
}

// Arreglo de numeros enteros
export function toIntegerIdArray(ids: string[]): number[] {
    return ids
        .map((id) => toNullableInteger(id))
        .filter((id): id is number => id != null);
}

// Convierte un valor numérico (number o string de PostgREST) 
// sin redondear a 2 decimales. 
export function toDecimalNumber(value: unknown): number {
    if (value === null || value === undefined || value === "") return 0;
    const n = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(n) ? n : 0;
}

// Conversión de valor EMPTY a NULL
export function emptyToNull(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    const s = String(value);
    return s.trim() === "" ? null : s;
}

// Conversión de número a formato de moneda
export const formatCurrency = (value: number, currency: CurrencyCode): string => {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: currency,
    }).format(value);
};