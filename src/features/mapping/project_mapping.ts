import {Project, ProjectFormState, ProjectFormData, SupabaseProjectRow} from "@/lib/types/project-types"
import { SupabaseZoneRow } from "@/lib/types/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers"
import { mapSupabaseRowToZone } from "@/features/mapping/zone_mapping"

// enlace con los atributos de Supabase
export function createProjectFormStateFromProject(project: Project): ProjectFormState {
    return {
        // propiedades generales
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        zona_info: project.zona_info,
        // cálculos de radiación
        hsp: project.hsp,
        ghi: project.ghi,
        // inputs generales
        demanda_electrica: project.demanda_electrica,
        tipo_conexion: project.tipo_conexion,
        cobertura_porcentaje: project.cobertura_porcentaje,
        rendimiento_modulo_porcentaje: project.rendimiento_modulo_porcentaje,
        relacion_dc_ac: project.relacion_dc_ac,
        // cálculos de requerimientos
        energia_requerida: project.energia_requerida,
        potencia_dc_requerida: project.potencia_dc_requerida,
        potencia_ac_requerida: project.potencia_ac_requerida,
        // fechas
        created_at: project.created_at,
        updated_at: project.updated_at,
        // estado
        estado_proyecto: project.estado_proyecto,
    }
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToProject(
	row: SupabaseProjectRow
): Project {
	return{
        // propiedades generales
		id: row.id?.toString() || "",
		nombre: row.nombre?.toString() || "",
        descripcion: row.descripcion?.toString() || "",
        zona_id: row.zona_id?.toString() || "",
        // -- Supabase may return the related zone under different keys depending on the select: use either 'zona_info' (alias) or 'zonas'
        zona_info: row.zona_info
            ? mapSupabaseRowToZone(row.zona_info as SupabaseZoneRow)
            : row.zonas
                ? mapSupabaseRowToZone(row.zonas as SupabaseZoneRow)
                : undefined,
        // inputs generales
        demanda_electrica: row.demanda_electrica?.toString() || "",
        tipo_conexion: row.tipo_conexion?.toString() || "",
        cobertura_porcentaje: row.cobertura_porcentaje?.toString() || "",
        rendimiento_modulo_porcentaje: row.rendimiento_modulo_porcentaje?.toString() || "",
        relacion_dc_ac: row.relacion_dc_ac?.toString() || "",
        // cálculos de requerimientos
        energia_requerida: row.energia_requerida?.toString() || "",
        potencia_dc_requerida: row.potencia_dc_requerida?.toString() || "",
        potencia_ac_requerida: row.potencia_ac_requerida?.toString() || "",
        // cálculos de radiación
        hsp: row.hsp?.toString() || "",
        ghi: row.ghi?.toString() || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // estado
        estado_proyecto: row.estado_proyecto?.toString() || "",
    }
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapProjectToSupabaseRow(
	project: ProjectFormData
): SupabaseProjectRow {
    const parseNumber = (v: unknown): number | undefined => {
        if (v === null || v === undefined) return undefined;
        if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
        const s = String(v).trim();
        if (s === "") return undefined;
        const n = Number(s);
        return Number.isFinite(n) ? n : undefined;
    };

    return {
        // propiedades generales
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        // inputs generales
        demanda_electrica: parseNumber(project.demanda_electrica),
        tipo_conexion: project.tipo_conexion,
        cobertura_porcentaje: parseNumber(project.cobertura_porcentaje),
        rendimiento_modulo_porcentaje: parseNumber(project.rendimiento_modulo_porcentaje),
        relacion_dc_ac: parseNumber(project.relacion_dc_ac),
        // cálculos de requerimientos
        energia_requerida: parseNumber(project.energia_requerida),
        potencia_dc_requerida: parseNumber(project.potencia_dc_requerida),
        potencia_ac_requerida: parseNumber(project.potencia_ac_requerida),
        // cálculos de radiación
        hsp: parseNumber(project.hsp),
        ghi: parseNumber(project.ghi),
        // fechas
        created_at: project.created_at,
        updated_at: project.updated_at,
        // estado
        estado_proyecto: project.estado_proyecto,
    };
}