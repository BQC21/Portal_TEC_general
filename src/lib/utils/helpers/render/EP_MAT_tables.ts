import { SupabaseEquiposRow } from "@/lib/types/supabase/equipos-types";
import { EQUIPOS_DEFAULTS, KNOWN_EQUIPO_COLUMNS, 
    KNOWN_MATERIAL_COLUMNS, MAPPED_EQUIPO_COLUMNS, MAPPED_MATERIAL_COLUMNS, MATERIALES_DEFAULTS, TypeProperty } from "../../consts/typeProperties";
import { EQUIPOS_TABLE, MATERIALES_TABLE } from "../../namingTolerance";
import { SupabaseMaterialesRow } from "@/lib/types/supabase/materiales-types";

export function catalogEquiposExtras(row: SupabaseEquiposRow): Record<string, string | number | null> {
    const extras: Record<string, string | number | null> = {};
    for (const [key, value] of Object.entries(row)) {
        if (MAPPED_EQUIPO_COLUMNS.has(key)) continue;
        if (typeof value === "string" || typeof value === "number" || value === null) {
            extras[key] = value;
        }
    }
    return extras;
}

export function catalogMaterialesExtras(row: SupabaseMaterialesRow): Record<string, string | number | null> {
    const extras: Record<string, string | number | null> = {};
    for (const [key, value] of Object.entries(row)) {
        if (MAPPED_MATERIAL_COLUMNS.has(key)) continue;
        if (typeof value === "string" || typeof value === "number" || value === null) {
            extras[key] = value;
        }
    }
    return extras;
}


export function suggestColumnName(label: string): string {
    const column = label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_+/g, "_");
    return /^[a-z][a-z0-9_]*$/.test(column) ? column : "";
}

export function isValidColumnName(column: string): boolean {
    return /^[a-z][a-z0-9_]*$/.test(column);
}

function normalizeTypeName(nombre?: string): string {
    return (nombre ?? "").trim().toUpperCase();
}

export function defaultPropertiesForType(nombre?: string, categoria?: string): TypeProperty[] {
    const key = normalizeTypeName(nombre);
    const category = (categoria ?? "").trim();
    const fromEquipos = EQUIPOS_DEFAULTS[key];
    const fromMateriales = MATERIALES_DEFAULTS[key];

    if (category === "Materiales") return fromMateriales ? [...fromMateriales] : [];
    if (category === "Ambas") {
        return uniqueProperties([...(fromEquipos ?? []), ...(fromMateriales ?? [])]);
    }
    return fromEquipos ? [...fromEquipos] : (fromMateriales ? [...fromMateriales] : []);
}

export function catalogPropertiesForCategory(categoria?: string): TypeProperty[] {
    const equipos = Object.values(EQUIPOS_DEFAULTS).flat();
    const materiales = Object.values(MATERIALES_DEFAULTS).flat();
    if (categoria === "Materiales") return uniqueProperties(materiales);
    if (categoria === "Ambas") return uniqueProperties([...equipos, ...materiales]);
    return uniqueProperties(equipos);
}

export function tablesForCategory(categoria?: string): string[] {
    if (categoria === "Materiales") return [MATERIALES_TABLE];
    if (categoria === "Ambas") return [EQUIPOS_TABLE, MATERIALES_TABLE];
    return [EQUIPOS_TABLE];
}

export function columnAlreadyExists(table: string, column: string): boolean {
    if (table === MATERIALES_TABLE) return KNOWN_MATERIAL_COLUMNS.has(column);
    return KNOWN_EQUIPO_COLUMNS.has(column);
}

export function parseTypeProperties(value: unknown): TypeProperty[] | undefined {
    if (value == null) return undefined;
    if (!Array.isArray(value)) return undefined;
    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const etiqueta = "etiqueta" in item ? String(item.etiqueta ?? "").trim() : "";
        const columna = "columna" in item ? String(item.columna ?? "").trim() : "";
        if (!etiqueta || !columna) return [];
        return [{ etiqueta, columna }];
    });
}

function uniqueProperties(properties: TypeProperty[]): TypeProperty[] {
    const seen = new Set<string>();
    return properties.filter((property) => {
        if (seen.has(property.columna)) return false;
        seen.add(property.columna);
        return true;
    });
}