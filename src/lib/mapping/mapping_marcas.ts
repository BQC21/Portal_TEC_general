import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { Brand, BrandFormData, BrandFormstate, SupabaseBrandRow } from "../types/supabase/brand.types"
import { mapSupabaseRowToSupplier } from "./mapping_proveedores"
import { Supplier, SupabaseSupplierRow } from "../types/supabase/supplier-types"
import { normalizeAssociationIds, toIntegerIdArray, toNullableInteger } from "../utils/normalization"

// Actualización del formulario
export function createBrandFormStateFromBrand(brand: Brand): BrandFormstate {
    const proveedor_ids = normalizeAssociationIds(brand.proveedor_ids, brand.proveedor_id);
    return {
        nombre: brand.nombre,
        categoria: brand.categoria,
        // fechas
        created_at: brand.created_at,
        updated_at: brand.updated_at,
        // proveedores
        proveedor_id: proveedor_ids[0] ?? "",
        proveedor_ids,
        proveedor_info: brand.proveedor_info,
        proveedores_info: brand.proveedores_info ?? [],
    }
}

// Rellena los objetos del proveedor
export function hydrateBrandSuppliers(brand: Brand, suppliers: Supplier[]): Brand {
    const proveedor_ids = normalizeAssociationIds(brand.proveedor_ids, brand.proveedor_id);
    const proveedores_info = proveedor_ids
        .map((id) => suppliers.find((item) => String(item.id) === id))
        .filter((item): item is Supplier => Boolean(item));

    return {
        ...brand,
        proveedor_ids,
        proveedores_info,
        proveedor_id: proveedor_ids[0] ?? "",
        proveedor_info: proveedores_info[0],
    };
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToBrand(
	row: SupabaseBrandRow
): Brand {
    const proveedor_ids = normalizeAssociationIds(row.proveedor_ids, row.proveedor_id);
    const nestedSupplier = row.proveedor_info
        ? mapSupabaseRowToSupplier(row.proveedor_info as SupabaseSupplierRow)
        : row.proveedores
            ? mapSupabaseRowToSupplier(row.proveedores as SupabaseSupplierRow)
            : undefined;
    const nestedSuppliers = Array.isArray(row.proveedores_info)
        ? row.proveedores_info.map((item) => mapSupabaseRowToSupplier(item as SupabaseSupplierRow))
        : nestedSupplier
            ? [nestedSupplier]
            : [];

	return{
        // propiedades generales
		id: row.id?.toString() || "",
        nombre: row.nombre?.toString() || "",
        categoria: row.categoria?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // proveeedor
        proveedor_id: proveedor_ids[0] ?? "",
        proveedor_ids,
        proveedor_info: nestedSuppliers[0],
        proveedores_info: nestedSuppliers,
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapBrandToSupabaseRow(
    brand: BrandFormData
): SupabaseBrandRow {
    const proveedor_ids = normalizeAssociationIds(brand.proveedor_ids, brand.proveedor_id);
    return {
        nombre: brand.nombre,
        categoria: brand.categoria,
        // marcas
        proveedor_id: toNullableInteger(proveedor_ids[0]),
        proveedor_ids: toIntegerIdArray(proveedor_ids),
        // fechas
        created_at: brand.created_at,
        updated_at: brand.updated_at,
    }
}