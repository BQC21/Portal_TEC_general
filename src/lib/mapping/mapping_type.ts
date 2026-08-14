import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { SupabaseTypeRow, Type, TypeFormData, TypeFormstate } from "../types/supabase/type-types"
import { mapSupabaseRowToZone } from "./zone_mapping"
import { SupabaseBrandRow } from "../types/supabase/brand.types"
import { mapSupabaseRowToBrand } from "./mapping_marcas"

// Actualización del formulario
export function createTypeFormStateFromType(type: Type): TypeFormstate {
    return {
        nombre: type.nombre,
        categoria: type.categoria,
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
        // marcas
        marca_id: type.marca_id,
        marca_info: type.marca_info,
    }
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToType(
	row: SupabaseTypeRow
): Type {
	return{
        // propiedades generales
		id: row.id?.toString() || "",
        nombre: row.nombre?.toString() || "",
        categoria: row.categoria?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // marcas
        marca_id: row.marca_id?.toString() || "",
        marca_info: row.marca_info
            ? mapSupabaseRowToBrand(row.marca_info as SupabaseBrandRow)
            : row.marcas
                ? mapSupabaseRowToBrand(row.marcas as SupabaseBrandRow)
                : undefined,
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapTypeToSupabaseRow(
    type: TypeFormData
): SupabaseTypeRow {
    return {
        nombre: type.nombre,
        categoria: type.categoria,
        // marcas
        marca_id: type.marca_id,
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
    }
}