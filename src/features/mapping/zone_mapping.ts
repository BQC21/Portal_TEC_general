import {Zone, ZoneFormState, ZoneFormData, SupabaseZoneRow} from "@/lib/types/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers"

// Actualización del formulario
export function createProjectFormStateFromProject(zone: Zone): ZoneFormState {
    return {
        zona: zone.zona,
        // cálculos de radiación
        latitude: zone.latitude,
        longitude: zone.longitude,
        ghi_respaldo: zone.ghi_respaldo,
        // fechas
        created_at: zone.created_at,
        updated_at: zone.updated_at,
    }
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToZone(
	row: SupabaseZoneRow
): Zone {
	return{
        // propiedades generales
		id: row.id?.toString() || "",
        zona: row.zona?.toString() || "",
        // cálculos de radiación
        latitude: row.latitude?.toString()  || "",
        longitude: row.longitude?.toString()  || "",
        ghi_respaldo: row.ghi_respaldo?.toString()  || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapProjectToSupabaseRow(
    zone: ZoneFormData
): SupabaseZoneRow {
    return {
        zona: zone.zona,
        // cálculos de radiación
        latitude: zone.latitude as unknown as number | undefined,
        longitude: zone.longitude as unknown as number | undefined,
        ghi_respaldo: zone.ghi_respaldo as unknown as number | undefined,
        // fechas
        created_at: zone.created_at,
        updated_at: zone.updated_at,
    }
}