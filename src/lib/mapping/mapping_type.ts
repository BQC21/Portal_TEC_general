import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage"
import { Brand } from "../types/supabase/brand.types"
import { SupabaseTypeRow, Type, TypeFormData, TypeFormstate } from "../types/supabase/type-types"
import { mapSupabaseRowToZone } from "./zone_mapping"
import { SupabaseBrandRow } from "../types/supabase/brand.types"
import { mapSupabaseRowToBrand } from "./mapping_marcas"
import { normalizeAssociationIds, toIntegerIdArray, toNullableInteger } from "../utils/normalization"

// Actualización del formulario
export function createTypeFormStateFromType(type: Type): TypeFormstate {
    const marca_ids = normalizeAssociationIds(type.marca_ids, type.marca_id);
    return {
        nombre: type.nombre,
        categoria: type.categoria,
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
        // marcas
        marca_id: marca_ids[0] ?? "",
        marca_ids,
        marca_info: type.marca_info,
        marcas_info: type.marcas_info ?? [],
    }
}

// Rellena los objetos de las marcas
export function hydrateTypeBrands(type: Type, brands: Brand[]): Type {
    const marca_ids = normalizeAssociationIds(type.marca_ids, type.marca_id);
    const marcas_info = marca_ids
        .map((id) => brands.find((item) => String(item.id) === id))
        .filter((item): item is Brand => Boolean(item));

    return {
        ...type,
        marca_ids,
        marcas_info,
        marca_id: marca_ids[0] ?? "",
        marca_info: marcas_info[0],
    };
}

/*
    Lectura de la base de datos de Supabase
*/
export function mapSupabaseRowToType(
	row: SupabaseTypeRow
): Type {
    const marca_ids = normalizeAssociationIds(row.marca_ids, row.marca_id);
    const nestedBrand = row.marca_info
        ? mapSupabaseRowToBrand(row.marca_info as SupabaseBrandRow)
        : row.marcas
            ? mapSupabaseRowToBrand(row.marcas as SupabaseBrandRow)
            : undefined;
    const nestedBrands = Array.isArray(row.marcas_info)
        ? row.marcas_info.map((item) => mapSupabaseRowToBrand(item as SupabaseBrandRow))
        : nestedBrand
            ? [nestedBrand]
            : [];

	return{
        // propiedades generales
		id: row.id?.toString() || "",
        nombre: row.nombre?.toString() || "",
        categoria: row.categoria?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // marcas
        marca_id: marca_ids[0] ?? "",
        marca_ids,
        marca_info: nestedBrands[0],
        marcas_info: nestedBrands,
	}
}

/*
    Envío de datos a la base de datos de Supabase
*/
export function mapTypeToSupabaseRow(
    type: TypeFormData
): SupabaseTypeRow {
    const marca_ids = normalizeAssociationIds(type.marca_ids, type.marca_id);
    return {
        nombre: type.nombre,
        categoria: type.categoria,
        // marcas
        marca_id: toNullableInteger(marca_ids[0]),
        marca_ids: toIntegerIdArray(marca_ids),
        // fechas
        created_at: type.created_at,
        updated_at: type.updated_at,
    }
}