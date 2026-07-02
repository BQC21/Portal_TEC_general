import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { SupabaseSupplierRow, Supplier, SupplierFormData, SupplierFormstate } from "../types/supabase/supplier-types"

// Actualización del formulario
export function createSupplierFormStateFromSupplier(supplier: Supplier): SupplierFormstate {
    return {
        nombre: supplier.nombre,
        ruc: supplier.ruc,
        contacto: supplier.contacto,
        telefono: supplier.telefono,
        categoria: supplier.categoria,
        codigo: supplier.codigo,
        // fechas
        created_at: supplier.created_at,
        updated_at: supplier.updated_at,
    }
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToSupplier(
	row: SupabaseSupplierRow
): Supplier {
	return{
        // propiedades generales
		id: row.id?.toString() || "",
        ruc: row.ruc?.toString() || "",
        nombre: row.nombre?.toString() || "",
        contacto: row.contacto?.toString() || "",
        telefono: row.telefono?.toString() || "",
        categoria: row.categoria?.toString() || "",
        codigo: row.codigo?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapSupplierToSupabaseRow(
    supplier: SupplierFormData
): SupabaseSupplierRow {
    return {
        nombre: supplier.nombre,
        ruc: supplier.ruc,
        contacto: supplier.contacto,
        telefono: supplier.telefono,
        categoria: supplier.categoria,
        codigo: supplier.codigo,
        // fechas
        created_at: supplier.created_at,
        updated_at: supplier.updated_at,
    }
}