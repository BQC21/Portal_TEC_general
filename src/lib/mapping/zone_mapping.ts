import {Zone, ZoneFormState, ZoneFormData, SupabaseZoneRow} from "@/lib/types/supabase/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"

// Actualización del formulario
export function createZoneFormStateFromZone(zone: Zone): ZoneFormState {
    return {
        zona: zone.zona,
        // cálculos de radiación
        latitude: zone.latitude,
        longitude: zone.longitude,
        ghi_respaldo: zone.ghi_respaldo,
        ghi_respaldo_diario: zone.ghi_respaldo_diario,
        gti_respaldo: zone.gti_respaldo,
        gti_respaldo_diario: zone.gti_respaldo_diario,
        hsp_peor_mes: zone.hsp_peor_mes,
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
        ghi_respaldo_diario: row.ghi_respaldo_diario?.toString()  || "",
        gti_respaldo: row.gti_respaldo?.toString()  || "",
        gti_respaldo_diario: row.gti_respaldo_diario?.toString()  || "",
        hsp_peor_mes: row.hsp_peor_mes?.toString()  || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapZoneToSupabaseRow(
    zone: ZoneFormData
): SupabaseZoneRow {
    return {
        zona: zone.zona,
        // cálculos de radiación
        latitude: zone.latitude as unknown as number | undefined,
        longitude: zone.longitude as unknown as number | undefined,
        ghi_respaldo: zone.ghi_respaldo as unknown as number | undefined,
        ghi_respaldo_diario: zone.ghi_respaldo_diario as unknown as number | undefined,
        gti_respaldo: zone.gti_respaldo as unknown as number | undefined,
        gti_respaldo_diario: zone.gti_respaldo_diario as unknown as number | undefined,
        hsp_peor_mes: zone.hsp_peor_mes as unknown as number | undefined,
        // fechas
        created_at: zone.created_at,
        updated_at: zone.updated_at,
    }
}