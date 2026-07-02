import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { SupabaseTypeRow, Type, TypeFormData, TypeFormstate } from "../types/supabase/type-types"

// Actualización del formulario
export function createTypeFormStateFromType(type: Type): TypeFormstate {
    return {
        nombre: type.nombre,
        categoria: type.categoria,
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
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
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
    }
}