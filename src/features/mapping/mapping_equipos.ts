import { Equipos, EquiposFormData, EquiposFormState, SupabaseEquiposRow } from "@/lib/types/equipos-types";
import { parseNullableDate, normalizeCurrencyCode } from "@/lib/utils/helpers"

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
    mppt_dod: equipo.mppt_dod,
    potencia_ac: equipo.potencia_ac,
    voc_vmax: equipo.voc_vmax,
    vmpp_vmin: equipo.vmpp_vmin,
    isc_imax_in: equipo.isc_imax_in,
    impp_imax_out: equipo.impp_imax_out,
    // precios
    unidad: equipo.unidad,
    precio_soles: equipo.precio_soles,
    precio_dolares: equipo.precio_dolares,
    igv: equipo.igv,
    precio_soles_igv: equipo.precio_soles_igv,
    precio_dolares_igv: equipo.precio_dolares_igv,
    // fechas
    created_at: equipo.created_at,
    updated_at: equipo.updated_at,
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
        potencia_maxima: row.potencia_maxima || 0,
        mppt_dod: row.mppt_dod || 0,
        potencia_ac: row.potencia_ac || 0,
        voc_vmax: row.voc_vmax || 0,
        vmpp_vmin: row.vmpp_vmin || 0,
        isc_imax_in: row.isc_imax_in || "",
        impp_imax_out: row.impp_imax_out || 0,
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
        mppt_dod: equipo.mppt_dod,
        potencia_ac: equipo.potencia_ac,
        voc_vmax: equipo.voc_vmax,
        vmpp_vmin: equipo.vmpp_vmin,
        isc_imax_in: equipo.isc_imax_in,
        impp_imax_out: equipo.impp_imax_out,
        // Precios
        unidad: equipo.unidad,
        precio_soles: equipo.precio_soles,
        precio_dolares: equipo.precio_dolares,
        igv: equipo.igv / 100,
        // fechas
        created_at: equipo.created_at ? new Date(equipo.created_at) : new Date(),
        updated_at: equipo.updated_at ? new Date(equipo.updated_at) : new Date(),
    };
}