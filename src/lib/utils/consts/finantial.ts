export const VAN_HORIZON = 20; // 19 años futuros + año 0 = 20 filas
export const OPEX_RATE = 0.015; // Porcentaje del CAPEX para calcular el OPEX
export const DEFAULT_MAX_YEAR = 20;
export const FIXED_MAX_YEAR = 20;
export const MIN_MAX_YEAR = 20;
export const computedFieldClass = "bg-rose-100 text-rose-900 border-rose-200";
export const MAX_CAMBIOS = 5;
export const CAMBIO_OPTIONS = Array.from({ length: MAX_CAMBIOS + 1 }, (_, count) => ({
    value: String(count),
    label: count === 1 ? "1 cambio" : `${count} cambios`,
}));
export const CAMBIO_ORDINAL = ["1er", "2do", "3er", "4to", "5to"];
