import {
    AWG_DARK_TEXT,
    AWG_MATRIX,
    AWG_TO_MM2,
    CURRENT_RANGES,
    DISTANCE_RANGES,
} from "@/lib/utils/consts/cableMatrix";

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
