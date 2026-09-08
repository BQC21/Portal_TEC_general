import { Product } from "../../../types/supabase/product-types";
import { isPriceOriginUSD } from "../computes/price_manage";

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

export function displayApplicableCellValue(value: unknown, applies: boolean): string {
    return applies ? displayCellValue(value) : "---";
}

export function getApplicableCellTextClass(
    value: unknown,
    applies: boolean,
    filledClass = "text-slate-900",
): string {
    return applies ? getCellTextClass(value, filledClass) : "text-slate-600";
}
// Obtener el tipo de divisa para resaltarlo
export function getPriceCellClass(product: Product, priceValue: number): string {
    const isCellUSD = priceValue === product.precio_dolares || priceValue === product.precio_dolares_igv;
    const isHighlighted = isCellUSD ? isPriceOriginUSD(product) : !isPriceOriginUSD(product);

    return isHighlighted ? "font-semibold text-slate-950" : "text-slate-700";
}