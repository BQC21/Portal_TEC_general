import {Zone, SupabaseZoneRow} from "@/lib/types/zone-types"
import { parseNullableDate } from "@/lib/utils/helpers"

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
