export type CableRange = {
    label: string;
    min: number;
    max: number;
};

//////// COLUMNA 3


// rangos de corriente
export const CURRENT_RANGES: CableRange[] = [
    { label: "0 - 5 A", min: 0, max: 5 },
    { label: "5 - 10 A", min: 5, max: 10 },
    { label: "10 - 15 A", min: 10, max: 15 },
    { label: "15 - 20 A", min: 15, max: 20 },
    { label: "20 - 25 A", min: 20, max: 25 },
    { label: "25 - 30 A", min: 25, max: 30 },
    { label: "30 - 40 A", min: 30, max: 40 },
    { label: "40 - 50 A", min: 40, max: 50 },
    { label: "50 - 60 A", min: 50, max: 60 },
    { label: "60 - 70 A", min: 60, max: 70 },
    { label: "70 - 80 A", min: 70, max: 80 },
    { label: "80 - 90 A", min: 80, max: 90 },
    { label: "90 - 100 A", min: 90, max: 100 },
    { label: "100 - 120 A", min: 100, max: 120 },
    { label: "120 - 150 A", min: 120, max: 150 },
    { label: "150 - 200 A", min: 150, max: 200 },
];

// rangos de distancia
export const DISTANCE_RANGES: CableRange[] = [
    { label: "0 - 40 m", min: 0, max: 40 },
    { label: "40 - 80 m", min: 40, max: 80 },
    { label: "80 - 120 m", min: 80, max: 120 },
    { label: "120 - 160 m", min: 120, max: 160 },
    { label: "160 - 200 m", min: 160, max: 200 },
    { label: "200 - 240 m", min: 200, max: 240 },
    { label: "240 - 280 m", min: 240, max: 280 },
];

// Filas: rangos de corriente. Columnas: rangos de distancia.
export const AWG_MATRIX: string[][] = [
    ["16", "16", "16", "16", "14", "12", "12"],
    ["16", "16", "14", "12", "10", "10", "10"],
    ["14", "14", "12", "10", "10", "8", "8"],
    ["14", "12", "12", "10", "8", "6", "6"],
    ["12", "10", "10", "8", "6", "6", "6"],
    ["10", "10", "10", "8", "6", "6", "4"],
    ["8", "8", "8", "6", "6", "4", "4"],
    ["8", "8", "6", "6", "4", "4", "2"],
    ["6", "6", "6", "4", "4", "2", "2"],
    ["6", "6", "4", "4", "2", "2", "1/0"],
    ["4", "4", "4", "4", "2", "2", "1/0"],
    ["4", "4", "4", "2", "2", "1/0", "1/0"],
    ["2", "2", "2", "2", "2", "1/0", "1/0"],
    ["2", "2", "2", "2", "1/0", "1/0", "2/0"],
    ["1/0", "1/0", "1/0", "1/0", "1/0", "2/0", "4/0"],
    ["2/0", "2/0", "2/0", "2/0", "2/0", "4/0", "4/0"],
];

/////// COLUMNA 4


export const AWG_ORDER: string[] = [
    "16", "14", "12", "10", "8", "6", "4", "2", "1/0", "2/0", "4/0",
];

export const AWG_TO_MM2: Record<string, number> = {
    "16": 1.5,
    "14": 2.5,
    "12": 4,
    "10": 6,
    "8": 10,
    "6": 16,
    "4": 25,
    "2": 35,
    "1/0": 55,
    "2/0": 70,
    "4/0": 110,
};

export const AWG_COLOR: Record<string, string> = {
    "16": "#FF0000",
    "14": "#ED7D31",
    "12": "#FFFF00",
    "10": "#00B050",
    "8": "#00B0F0",
    "6": "#8FAADC",
    "4": "#2F5597",
    "2": "#7030A0",
    "1/0": "#FF6699",
    "2/0": "#FF0066",
    "4/0": "#FFD966",
};

// Los fondos amarillos necesitan texto oscuro para que el contenido sea legible.
const AWG_DARK_TEXT = new Set(["12", "4/0"]);

export function awgTextColor(awg: string): string {
    return AWG_DARK_TEXT.has(awg) ? "#1E293B" : "#FFFFFF";
}

/**
 * Devuelve el índice del rango de corriente al que pertenece el valor dado.
 * Retorna -1 cuando la corriente es 0 o supera el máximo cubierto por la matriz.
 */
export function findCurrentRangeIndex(current: number): number {
    if (!Number.isFinite(current) || current <= 0) return -1;
    return CURRENT_RANGES.findIndex((range) => current <= range.max);
}

export function findDistanceRangeIndex(label: string): number {
    if (!label) return -1;
    return DISTANCE_RANGES.findIndex((range) => range.label === label);
}

export function getAwgForSelection(currentIndex: number, distanceIndex: number): string | null {
    if (currentIndex < 0 || distanceIndex < 0) return null;
    return AWG_MATRIX[currentIndex]?.[distanceIndex] ?? null;
}

export function getMm2ForAwg(awg: string | null): number | null {
    if (!awg) return null;
    return AWG_TO_MM2[awg] ?? null;
}
