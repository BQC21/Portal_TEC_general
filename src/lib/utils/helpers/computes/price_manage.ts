import { Product } from "../../../types/product-types";
import { toSafeNumber } from "../../normalization";

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