import { Equipos, EquiposFormData, EquiposFormState, SupabaseEquiposRow } from "@/lib/types/supabase/equipos-types";
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage";
import { mapSupabaseRowToType } from "./mapping_type";
import { SupabaseTypeRow } from "../types/supabase/type-types";
import { mapSupabaseRowToBrand } from "./mapping_marcas";
import { SupabaseBrandRow } from "../types/supabase/brand.types";
import { mapSupabaseRowToSupplier } from "./mapping_proveedores";
import { SupabaseSupplierRow } from "../types/supabase/supplier-types";
import { emptyToNull, toDecimalNumber, toNullableInteger } from "../utils/normalization";

// enlace con los atributos de Supabase
export function createEquiposFormStateFromEquipos(equipo: Equipos): EquiposFormState {
    return {
        // propiedades generales
        cod_prov: equipo.cod_prov,
        proveedor: equipo.proveedor,
        cod_producto: equipo.cod_producto,
        tipo_de_producto: equipo.tipo_de_producto,
        marca: equipo.marca,
        descripcion: equipo.descripcion,
        // propiedades eléctricas
        tipo_conexion: equipo.tipo_conexion,
        potencia_maxima: equipo.potencia_maxima,
        mppt: equipo.mppt,
        cadenas: equipo.cadenas,
        dod: equipo.dod,
        potencia_ac: equipo.potencia_ac,
        vmpp_vmin: equipo.vmpp_vmin,
        voc_vmax: equipo.voc_vmax,
        isc_i_out: equipo.isc_i_out,
        impp_i_in: equipo.impp_i_in,
        // precios
        unidad: equipo.unidad,
        precio_soles: equipo.precio_soles,
        precio_dolares: equipo.precio_dolares,
        igv: equipo.igv,
        precio_soles_igv: equipo.precio_soles_igv,
        precio_dolares_igv: equipo.precio_dolares_igv,
        priceInputCurrency: equipo.priceInputCurrency,
        // fechas
        created_at: equipo.created_at,
        updated_at: equipo.updated_at,
        // conexión con otras tablas
        tipo_id: equipo.tipo_id,
        tipo_info: equipo.tipo_info,
        marca_id: equipo.marca_id,
        marca_info: equipo.marca_info,
        proveedor_id: equipo.proveedor_id,
        proveedor_info: equipo.proveedor_info,
    };
}

/**
 * Lectura de la base de datos de Supabase
 */
export function mapSupabaseRowToEquipos(
    row: SupabaseEquiposRow
): Equipos {
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
        tipo_conexion: row.tipo_de_conexion || row.tipo_conexion || "",
        potencia_maxima: toDecimalNumber(row.potencia_maxima),
        mppt: toDecimalNumber(row.mppt),
        cadenas: toDecimalNumber(row.cadenas),
        dod: toDecimalNumber(row.dod),
        potencia_ac: toDecimalNumber(row.potencia_ac),
        vmpp_vmin: toDecimalNumber(row.vmpp_vmin),
        voc_vmax: toDecimalNumber(row.voc_vmax),
        isc_i_out: toDecimalNumber(row.isc_i_out),
        impp_i_in: row.impp_i_in || "",
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
export function mapEquiposToSupabaseRow(
    equipo: EquiposFormData
): SupabaseEquiposRow {
    return {
        // propiedades generales
        cod_prov: equipo.cod_prov,
        proveedor: equipo.proveedor,
        cod_producto: equipo.cod_producto,
        tipo_de_producto: equipo.tipo_de_producto,
        marca: equipo.marca,
        descripcion: equipo.descripcion,
        // propiedades eléctricas
        tipo_de_conexion: equipo.tipo_conexion,
        potencia_maxima: equipo.potencia_maxima,
        mppt: equipo.mppt,
        cadenas: equipo.cadenas,
        dod: equipo.dod,
        potencia_ac: equipo.potencia_ac,
        vmpp_vmin: equipo.vmpp_vmin,
        voc_vmax: equipo.voc_vmax,
        isc_i_out: equipo.isc_i_out,
        impp_i_in: emptyToNull(equipo.impp_i_in) ?? undefined,
        // Precios
        unidad: equipo.unidad,
        precio_soles: equipo.precio_soles,
        precio_dolares: equipo.precio_dolares,
        igv: equipo.igv / 100,
        priceInputCurrency: equipo.priceInputCurrency,
        // fechas
        created_at: equipo.created_at ? new Date(equipo.created_at) : new Date(),
        updated_at: equipo.updated_at ? new Date(equipo.updated_at) : new Date(),
        // conexión con otras tablas
        tipo_id: toNullableInteger(equipo.tipo_id) ?? undefined,
        marca_id: toNullableInteger(equipo.marca_id) ?? undefined,
        proveedor_id: toNullableInteger(equipo.proveedor_id) ?? undefined,
    };
}