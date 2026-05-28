// -------------------------
// Funciones para Normalización y Formateo de Datos
// -------------------------

import { Product } from "../types/product-types";

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
		console.warn(`toSafeNumber: value '${String(value)}' parsed as ${parsed} exceeds max ${MAX_SAFE_UPLOAD_NUMBER}, capping.`);
		return Math.sign(parsed) * MAX_SAFE_UPLOAD_NUMBER;
	}

	return parsed;
}

// función para normalizar el código de moneda, asegurando que solo se acepten "PEN" o "USD"
export function normalizeCurrencyCode(value: unknown): "PEN" | "USD" {
	if (value === "USD" || value === "PEN") {
		return value;
	}

		return "PEN";
}

// -------------------------
// Funciones para el manejo de celdas vacías y formateo de texto en la tabla
// -------------------------

// leer si la celda está vacía
export function isEmptyCellValue(value: unknown): boolean {
	return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}
// Condicionar el coloreado de la celda
export function getCellTextClass(value: unknown, filledClass = "text-slate-900"): string {
	return isEmptyCellValue(value) ? "text-slate-600" : filledClass;
}
// Mostrar el contenido
export function displayCellValue(value: unknown): string {
	return isEmptyCellValue(value) ? "---" : String(value);
}

export function getPriceCellClass(product: Product, priceValue: number): string {
	const isCellUSD = priceValue === product.precio_dolares || priceValue === product.precio_dolares_igv;
	const isHighlighted = isCellUSD ? isPriceOriginUSD(product) : !isPriceOriginUSD(product);

	return isHighlighted ? "font-semibold text-slate-950" : "text-slate-700";
}


// -------------------------
// Funciones para el manejo de fechas
// -------------------------


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

// función para verificar si el precio del producto está en dólares
export function isPriceOriginUSD(product: Product): boolean {
	return product.priceInputCurrency === "USD";
} // función para verificar si el precio del producto está en dólares
export function formatPen(value: unknown) {
	return `S/. ${toSafeNumber(value).toFixed(2)}`;
} // formatear el precio en soles
export function formatUsd(value: unknown) {
	return `$ ${toSafeNumber(value).toFixed(2)}`;
} // formatear el precio en dólares
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