import {
    BRAND_OPTIONS_MATERIALES,
    MATERIALES_TYPE_OPTIONS,
} from "@/lib/utils/options";

/**
 * Cascada estática proveedor → marcas/tipos para materiales.
 * Se usa cuando la cascada por datos existentes no alcanza
 * (p. ej. FerroVoz, Ferretería Choque, Project & Quality).
 */
export const MATERIAL_SUPPLIER_CASCADE_MAP: Record<
    string,
    { brands: string[]; types: string[] }
> = {
    FerroVoz: {
        brands: [...BRAND_OPTIONS_MATERIALES],
        types: [...MATERIALES_TYPE_OPTIONS],
    },
    "Ferretería Choque": {
        brands: [...BRAND_OPTIONS_MATERIALES],
        types: [...MATERIALES_TYPE_OPTIONS],
    },
    "Project & Quality": {
        brands: [...BRAND_OPTIONS_MATERIALES],
        types: [...MATERIALES_TYPE_OPTIONS],
    },
    // Alias de grafía en catálogo / datos legacy
    "Proyect & Quality S.A.C.": {
        brands: [...BRAND_OPTIONS_MATERIALES],
        types: [...MATERIALES_TYPE_OPTIONS],
    },
    "Proyect & Quality": {
        brands: [...BRAND_OPTIONS_MATERIALES],
        types: [...MATERIALES_TYPE_OPTIONS],
    },
};

export function getMaterialSupplierCascade(proveedor: string) {
    return MATERIAL_SUPPLIER_CASCADE_MAP[proveedor] ?? null;
}
