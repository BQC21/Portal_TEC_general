import {Project, ProjectFormState, ProjectFormData, SupabaseProjectRow} from "@/lib/types/project-types"
import { SupabaseZoneRow } from "@/lib/types/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { mapSupabaseRowToZone } from "@/lib/mapping/zone_mapping"
import { parseNumber } from "../utils/normalization";

// enlace con los atributos de Supabase
export function createProjectFormStateFromProject(project: Project): ProjectFormState {
    return {
        // propiedades generales
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        zona_info: project.zona_info,
        tipo_instalacion: project.tipo_instalacion,
        // cálculos de radiación
        hsp: project.hsp,
        ghi: project.ghi,
        // inputs generales
        demanda_electrica: project.demanda_electrica,
        configuracion: project.configuracion,
        cobertura_porcentaje: project.cobertura_porcentaje,
        rendimiento_modulo_porcentaje: project.rendimiento_modulo_porcentaje,
        // cálculos de requerimientos
        energia_requerida: project.energia_requerida,
        potencia_dc_requerida: project.potencia_dc_requerida,
        potencia_ac_requerida: project.potencia_ac_requerida,
        strings_min: project.strings_min,
        strings_max: project.strings_max,
        strings: project.strings,
        itm_ac_min: project.itm_ac_min,
        itm_dc_min: project.itm_dc_min,
        spd_voltage: project.spd_voltage,
        // fechas
        created_at: project.created_at,
        updated_at: project.updated_at,
        // estado
        estado_proyecto: project.estado_proyecto,
        //enlace
        enlace: project.enlace
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
        // -- Supabase may return the related zone under different keys depending on the select: 
        // use either 'zona_info' (alias) or 'zonas'
        zona_info: row.zona_info
            ? mapSupabaseRowToZone(row.zona_info as SupabaseZoneRow)
            : row.zonas
                ? mapSupabaseRowToZone(row.zonas as SupabaseZoneRow)
                : undefined,
        tipo_instalacion: row.tipo_instalacion?.toString() || "",
        // inputs generales
        demanda_electrica: row.demanda_electrica?.toString() || "",
        configuracion: row.configuracion?.toString() || "",
        cobertura_porcentaje: row.cobertura_porcentaje?.toString() || "",
        rendimiento_modulo_porcentaje: row.rendimiento_modulo_porcentaje?.toString() || "",
        // cálculos de requerimientos
        energia_requerida: row.energia_requerida?.toString() || "",
        potencia_dc_requerida: row.potencia_dc_requerida?.toString() || "",
        potencia_ac_requerida: row.potencia_ac_requerida?.toString() || "",
        strings_min: row.strings_min?.toString() || "",
        strings_max: row.strings_max?.toString() || "",
        strings: row.strings?.toString() || "",
        itm_ac_min: row.itm_ac_min?.toString() || "",
        itm_dc_min: row.itm_dc_min?.toString() || "",
        spd_voltage: row.spd_voltage?.toString() || "",
        // cálculos de radiación
        hsp: row.hsp?.toString() || "",
        ghi: row.ghi?.toString() || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // estado
        estado_proyecto: row.estado_proyecto?.toString() || "",
        // enlace        
        enlace: row.enlace?.toString() || "",
    }
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapProjectToSupabaseRow(
	project: ProjectFormData
): SupabaseProjectRow {
    return {
        // propiedades generales
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        tipo_instalacion: project.tipo_instalacion,
        // inputs generales
        demanda_electrica: parseNumber(project.demanda_electrica),
        configuracion: project.configuracion,
        cobertura_porcentaje: parseNumber(project.cobertura_porcentaje),
        rendimiento_modulo_porcentaje: parseNumber(project.rendimiento_modulo_porcentaje),
        // cálculos de requerimientos
        energia_requerida: parseNumber(project.energia_requerida),
        potencia_dc_requerida: parseNumber(project.potencia_dc_requerida),
        potencia_ac_requerida: parseNumber(project.potencia_ac_requerida),
        strings_min: parseNumber(project.strings_min),
        strings_max: parseNumber(project.strings_max),
        strings: parseNumber(project.strings),
        itm_ac_min: parseNumber(project.itm_ac_min),
        itm_dc_min: parseNumber(project.itm_dc_min),
        spd_voltage: parseNumber(project.spd_voltage),
        // cálculos de radiación
        hsp: parseNumber(project.hsp),
        ghi: parseNumber(project.ghi),
        // fechas
        created_at: project.created_at,
        updated_at: project.updated_at,
        // estado
        estado_proyecto: project.estado_proyecto,
        // enlace
        enlace: project.enlace,
    };
}