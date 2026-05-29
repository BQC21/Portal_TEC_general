// -------------------------
// Funciones para Normalización y Formateo de Datos
// -------------------------

// función para convertir un valor a número de forma segura
export function toSafeNumber(value: unknown): number {
    const parsed =
        typeof value === "number"
        ? value
        : typeof value === "string"
            ? Number(value)
            : Number.NaN;

    return Number.isFinite(parsed) ? parsed : 0;
}

// función para normalizar el código de moneda, asegurando que solo se acepten "PEN" o "USD"
export function normalizeCurrencyCode(value: unknown): "PEN" | "USD" {
	if (value === "USD" || value === "PEN") {
		return value;
	}

		return "PEN";
}