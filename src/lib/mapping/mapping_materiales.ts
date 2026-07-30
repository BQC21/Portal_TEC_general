import { Materiales, MaterialesFormData, MaterialesFormState, SupabaseMaterialesRow } from "@/lib/types/supabase/materiales-types";
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage";
import { mapSupabaseRowToType } from "./mapping_type";
import { SupabaseTypeRow } from "../types/supabase/type-types";
import { SupabaseBrandRow } from "../types/supabase/brand.types";
import { mapSupabaseRowToBrand } from "./mapping_marcas";
import { mapSupabaseRowToSupplier } from "./mapping_proveedores";
import { SupabaseSupplierRow } from "../types/supabase/supplier-types";

// enlace con los atributos de Supabase
export function createMaterialesFormStateFromMateriales(material: Materiales): MaterialesFormState {
    return {
    // propiedades generales
    cod_prov: material.cod_prov,
    proveedor: material.proveedor,
    cod_producto: material.cod_producto,
    tipo_de_producto: material.tipo_de_producto,
    marca: material.marca,
    descripcion: material.descripcion,
    // propiedades eléctricas
    parte_electrica: material.parte_electrica,
    // precios
    unidad: material.unidad,
    precio_soles: material.precio_soles,
    precio_dolares: material.precio_dolares,
    igv: material.igv,
    precio_soles_igv: material.precio_soles_igv,
    precio_dolares_igv: material.precio_dolares_igv,
    // fechas
    created_at: material.created_at,
    updated_at: material.updated_at,
    // conexión con otras tablas
    tipo_id: material.tipo_id,
    tipo_info: material.tipo_info,
    marca_id: material.marca_id,
    marca_info: material.marca_info,
    proveedor_id: material.proveedor_id,
    proveedor_info: material.proveedor_info,
    priceInputCurrency: material.priceInputCurrency,
    };
}

/**
 * Lectura de la base de datos de Supabase
 */
export function mapSupabaseRowToMateriales(
    row: SupabaseMaterialesRow
): Materiales {
    return {
        // propiedades generales
        id: row.id?.toString() || "",
        cod_prov: row.cod_prov || "",
        proveedor: row.proveedor || "",
        cod_producto: row.cod_producto || "",
        tipo_de_producto: row.tipo_de_producto || "",
        marca: row.marca || "",
        descripcion: row.descripcion || "",
        // propiedades eléctricas
        parte_electrica: row.parte_electrica || "",
        // Precios
        unidad: row.unidad || "",
        precio_soles: row.precio_soles || 0,
        precio_dolares: row.precio_dolares || 0,
        igv: row.igv ? row.igv * 100 : 0,
        precio_soles_igv: row.precio_soles_igv || 0,
        precio_dolares_igv: row.precio_dolares_igv || 0,
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        // conexión con otras tablas
        tipo_id: row.tipo_id?.toString() || "",
        tipo_info: row.tipo_info
            ? mapSupabaseRowToType(row.tipo_info as SupabaseTypeRow)
            : row.tipos
                ? mapSupabaseRowToType(row.tipos as SupabaseTypeRow)
                : undefined,
        marca_id: row.marca_id?.toString() || "",
        marca_info: row.marca_info
            ? mapSupabaseRowToBrand(row.marca_info as SupabaseBrandRow)
            : row.marcas
                ? mapSupabaseRowToBrand(row.marcas as SupabaseBrandRow)
                : undefined,
        proveedor_id: row.proveedor_id?.toString() || "",
        proveedor_info: row.proveedor_info
            ? mapSupabaseRowToSupplier(row.proveedor_info as SupabaseSupplierRow)
            : row.proveedores
                ? mapSupabaseRowToSupplier(row.proveedores as SupabaseSupplierRow)
                : undefined,
        priceInputCurrency: row.priceInputCurrency || "",
    };
}

/**
 * Envío de datos a la base de datos de Supabase
 */
export function mapMaterialesToSupabaseRow(
    material: MaterialesFormData
): SupabaseMaterialesRow {
    return {
        // propiedades generales
        cod_prov: material.cod_prov,
        proveedor: material.proveedor,
        cod_producto: material.cod_producto,
        tipo_de_producto: material.tipo_de_producto,
        marca: material.marca,
        descripcion: material.descripcion,
        // propiedades eléctricas
        parte_electrica: material.parte_electrica,
        // Precios
        unidad: material.unidad,
        precio_soles: material.precio_soles,
        precio_dolares: material.precio_dolares,
        igv: material.igv / 100,
        priceInputCurrency: material.priceInputCurrency,
        // fechas
        created_at: material.created_at ? new Date(material.created_at) : new Date(),
        updated_at: material.updated_at ? new Date(material.updated_at) : new Date(),
        // conexión con otras tablas
        tipo_id: material.tipo_id,
        marca_id: material.marca_id,
        proveedor_id: material.proveedor_id,
    };
}