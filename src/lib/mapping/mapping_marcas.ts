import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { Brand, BrandFormData, BrandFormstate, SupabaseBrandRow } from "../types/supabase/brand.types"
import { mapSupabaseRowToSupplier } from "./mapping_proveedores"
import { SupabaseSupplierRow } from "../types/supabase/supplier-types"

// Actualización del formulario
export function createBrandFormStateFromBrand(brand: Brand): BrandFormstate {
    return {
        nombre: brand.nombre,
        categoria: brand.categoria,
        // fechas
        created_at: brand.created_at,
        updated_at: brand.updated_at,
        // proveedores
        proveedor_id: brand.proveedor_id,
        proveedor_info: brand.proveedor_info,
    }
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToBrand(
	row: SupabaseBrandRow
): Brand {
	return{
        // propiedades generales
		id: row.id?.toString() || "",
        nombre: row.nombre?.toString() || "",
        categoria: row.categoria?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // proveeedor
        proveedor_id: row.proveedor_id?.toString() || "",
        proveedor_info: row.proveedor_info
            ? mapSupabaseRowToSupplier(row.proveedor_info as SupabaseSupplierRow)
            : row.proveedores
                ? mapSupabaseRowToSupplier(row.proveedores as SupabaseSupplierRow)
                : undefined,
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapBrandToSupabaseRow(
    brand: BrandFormData
): SupabaseBrandRow {
    return {
        nombre: brand.nombre,
        categoria: brand.categoria,
        // marcas
        proveedor_id: brand.proveedor_id,
        // fechas
        created_at: brand.created_at,
        updated_at: brand.updated_at,
    }
}