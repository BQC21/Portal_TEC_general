// -------------------------
// Funciones para Normalización y Formateo de Datos
// -------------------------


// función para normalizar el código de moneda, asegurando que solo se acepten "PEN" o "USD"
export function normalizeCurrencyCode(value: unknown): "PEN" | "USD" {
	if (value === "USD" || value === "PEN") {
		return value;
	}

		return "PEN";
}

// función para imprimir valores nullables de fecha en un formato legible, o un guion si el valor es inválido o nulo
export function parseNullableDate(value: Date | string | null | undefined): Date | null {
	if (!value) return null;

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

// Formato de fecha
export function formatDate(value: unknown) {
    if (!value) return "-";

    const date = value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-PE");
}

// obtenemos la fecha actual para asignarla a los productos al momento de su creación o actualización
export function getCurrentDate(): Date {
    return new Date();
}

// -------------------------
// Funciones para el manejo de precios y monedas
// -------------------------

export function formatReadonlyCurrency(symbol: string, value: number) {
	return `${symbol} ${value.toFixed(2)}`;
} // formato de moneda para campos de solo lectura
export function convertPenToUsd(pricePen: number, exchangeRate: number): number {
	return pricePen / exchangeRate;
} // de soles a dolares
export function convertUsdToPen(priceUsd: number, exchangeRate: number): number {
	return priceUsd * exchangeRate;
} // de dolares a soles
export function computePricesWithIgv(pricePen: number, priceUsd: number, igvPercent: number) {
	const igvFactor = 1 + igvPercent / 100;

	return {
		pricePen,
		priceUsd,
		totalPen: pricePen * igvFactor,
		totalUsd: priceUsd * igvFactor,
	};
} // calcular el precio con IGV sea PEN o USD