import { Materiales } from "@/lib/types/supabase/materiales-types";

function extractNumericValues(descripcion: string): number[] {
    return (descripcion.match(/\d+/g) ?? []).map((value) => parseInt(value, 10));
}

export function extractItmAcRating(descripcion: string): number | null {
    if (!descripcion.includes("ITM") || descripcion.includes("VDC")) {
        return null;
    }

    const values = extractNumericValues(descripcion);
    return values.length >= 2 ? values[1] : values[0] ?? null;
}

export function extractItmDcRating(descripcion: string): number | null {
    if (!descripcion.includes("ITM") || !descripcion.includes("VDC")) {
        return null;
    }

    const values = extractNumericValues(descripcion);
    return values.length >= 3 ? values[2] : values[values.length - 1] ?? null;
}

export function extractSpdRating(descripcion: string): number | null {
    if (!descripcion.includes("SPD")) {
        return null;
    }

    const values = extractNumericValues(descripcion);
    return values.length >= 2 ? values[1] : values[0] ?? null;
}

export function getNearestHigherItmAcRating(
    materiales: Materiales[],
    label: string,
    itmAcMin: number,
): number | null {
    if (isNaN(itmAcMin) || itmAcMin <= 0) {
        return null;
    }

    const qualifyingRatings = materiales
        .filter(
            (material) =>
                material.tipo_de_producto === label &&
                material.descripcion.includes("ITM") &&
                !material.descripcion.includes("VDC"),
        )
        .map((material) => extractItmAcRating(material.descripcion))
        .filter((rating): rating is number => rating !== null && rating >= itmAcMin);

    if (qualifyingRatings.length === 0) {
        return null;
    }

    return Math.min(...qualifyingRatings);
}
