import {Project, ProjectFormState, ProjectFormData, SupabaseProjectRow} from "@/lib/types/project-types"
import { SupabaseZoneRow } from "@/lib/types/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers"
import { mapSupabaseRowToZone } from "@/features/mapping/zone_mapping"

// enlace con los atributos de Supabase
export function createProjectFormStateFromProject(project: Project): ProjectFormState {
    return {
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        zona_info: project.zona_info,
        hsp: project.hsp,
        ghi: project.ghi,
        created_at: project.created_at,
        updated_at: project.updated_at,
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
		id: row.id?.toString() || "",
		nombre: row.nombre?.toString() || "",
        descripcion: row.descripcion?.toString() || "",
        zona_id: row.zona_id?.toString() || "",
        // Supabase may return the related zone under different keys depending on the select: use either 'zona_info' (alias) or 'zonas'
        zona_info: row.zona_info
            ? mapSupabaseRowToZone(row.zona_info as SupabaseZoneRow)
            : row.zonas
                ? mapSupabaseRowToZone(row.zonas as SupabaseZoneRow)
                : undefined,
        hsp: row.hsp?.toString() || "",
        ghi: row.ghi?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        estado_proyecto: row.estado_proyecto?.toString() || "",
    }
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapProjectToSupabaseRow(
	project: ProjectFormData
): SupabaseProjectRow {
	return {
        nombre: project.nombre,
        descripcion: project.descripcion,
        zona_id: project.zona_id,
        hsp: project.hsp as unknown as number | undefined,
        ghi: project.ghi as unknown as number | undefined,
        created_at: project.created_at,
        updated_at: project.updated_at,
        estado_proyecto: project.estado_proyecto,
	}
}