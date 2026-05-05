import { Product, ProductFormData, ProductFormState, SupabaseProductRow } from "@/lib/types/product-types";
import { parseNullableDate, normalizeCurrencyCode } from "@/lib/utils/helpers"

// enlace con los atributos de Supabase
export function createProductFormStateFromProduct(product: Product): ProductFormState {
	return {
    // propiedades generales
    ruc: product.ruc,
		proveedor: product.proveedor,
		cod_prov: product.cod_prov,
		codigo: product.codigo,
		tipo: product.tipo,
		marca: product.marca,
		unidad: product.unidad,
		descripcion: product.descripcion,
    // propiedades bateria
    tipo_conexion_bateria: product.tipo_conexion_bateria,
    dod: product.dod,
    amperaje_bateria: product.amperaje_bateria,
    voltaje_bateria: product.voltaje_bateria,
    // propiedades inversor
    tipo_conexion_inversor: product.tipo_conexion_inversor,
    potencia_dc_inversor: product.potencia_dc_inversor,
    potencia_ac_inversor: product.potencia_ac_inversor,
    mppt: product.mppt,
    i_entrada_inversor: product.i_entrada_inversor,
    i_salida_inversor: product.i_salida_inversor,
    voltaje_maximo_inversor: product.voltaje_maximo_inversor,
    // propiedades modulo
    potencia_modulo: product.potencia_modulo,
    voc: product.voc,
    vmpp: product.vmpp,
    isc: product.isc,
    impp: product.impp,
		panel_area: product.panel_area,
    // propiedades cableado
    fuente_electrica: product.fuente_electrica,
    // propiedades estructura 
		panel_array: product.panel_array,
    // propiedades smart meter
    tipo_conexion_smartmeter: product.tipo_conexion_smartmeter,
    // precios
		priceInputCurrency: product.priceInputCurrency,
		precio_soles: product.precio_soles,
		precio_dolares: product.precio_dolares,
		igv: product.igv,
		precio_soles_igv: product.precio_soles_igv,
		precio_dolares_igv: product.precio_dolares_igv,
    // fechas
		created_at: product.created_at,
		updated_at: product.updated_at,
    // estado de importación
		estado_equipo: product.estado_equipo,
    fecha_estimada_importacion: 
			product.estado_equipo === "En importación" ? product.fecha_estimada_importacion : null,
	};
}

/**
 * Lectura de la base de datos de Supabase
 */
export function mapSupabaseRowToProduct(
  row: SupabaseProductRow
): Product {
  return {
    // propiedades generales
    id: row.id?.toString() || "",
    ruc: row.ruc || "",
    cod_prov: row.cod_prov || "",
    proveedor: row.proveedor || "",
    codigo: row.codigo || "",
    tipo: row.tipo || "",
    marca: row.marca || "",
    unidad: row.unidad || "",
    descripcion: row.descripcion || "",
    // propiedades de batería
    tipo_conexion_bateria: row.tipo_conexion_bateria || "",
    dod: row.dod?.toString() || "",
    amperaje_bateria: row.amperaje_bateria?.toString() || "",
    voltaje_bateria: row.voltaje_bateria?.toString() || "",
    // propiedades de inversor
    tipo_conexion_inversor: row.tipo_conexion_inversor || "",
    potencia_dc_inversor: row.potencia_dc_inversor?.toString() || "",
    potencia_ac_inversor: row.potencia_ac_inversor?.toString() || "",
    mppt: row.mppt?.toString() || "",
    i_entrada_inversor: row.i_entrada_inversor?.toString() || "",
    i_salida_inversor: row.i_salida_inversor?.toString() || "",
    voltaje_maximo_inversor: row.voltaje_maximo_inversor?.toString() || "",
    // propiedades de módulo
    potencia_modulo: row.potencia_modulo?.toString() || "",
    voc: row.voc?.toString() || "",
    vmpp: row.vmpp?.toString() || "",
    isc: row.isc?.toString() || "",
    impp: row.impp?.toString() || "",
    panel_area: row.panel_area?.toString() || " ",
    // propiedades de cableado
    fuente_electrica: row.fuente_electrica || "",
    // propiedades de estructura
    panel_array: row.panel_array?.toString() || " ",
    // propiedades de smart meter
    tipo_conexion_smartmeter: row.tipo_conexion_smartmeter || "",
    // currency source naming
    priceInputCurrency: normalizeCurrencyCode(row.priceInputCurrency),
    // Precios
    precio_soles: row.precio_soles || 0,
    precio_dolares: row.precio_dolares || 0,
    igv: row.igv ? row.igv * 100 : 0,
    precio_soles_igv: row.precio_soles_igv || 0,
    precio_dolares_igv: row.precio_dolares_igv || 0,
    // fechas
    created_at: parseNullableDate(row.created_at) ?? new Date(),
    updated_at: parseNullableDate(row.updated_at) ?? new Date(),
    // estado de importación
    estado_equipo: row.estado_equipo || "",
    fecha_estimada_importacion:
      row.estado_equipo === "En importación"
        ? parseNullableDate(row.fecha_estimada_importacion)
        : null,
  };
}

/**
 * Envío de datos a la base de datos de Supabase
 */
export function mapProductToSupabaseRow(
  product: ProductFormData
): SupabaseProductRow {
  return {
    // propiedades generales
    ruc: product.ruc || "",
    cod_prov: product.cod_prov,
    proveedor: product.proveedor,
    codigo: product.codigo,
    tipo: product.tipo,
    marca: product.marca,
    unidad: product.unidad,
    descripcion: product.descripcion,
    // propiedades de batería
    tipo_conexion_bateria: product.tipo_conexion_bateria,
    dod: Number(product.dod) || undefined,
    amperaje_bateria: Number(product.amperaje_bateria) || undefined,
    voltaje_bateria: Number(product.voltaje_bateria) || undefined,
    // propiedades de inversor
    tipo_conexion_inversor: product.tipo_conexion_inversor,
    potencia_dc_inversor: Number(product.potencia_dc_inversor) || undefined,
    potencia_ac_inversor: Number(product.potencia_ac_inversor) || undefined,
    mppt: Number(product.mppt) || undefined,
    i_entrada_inversor: Number(product.i_entrada_inversor) || undefined,
    i_salida_inversor: Number(product.i_salida_inversor) || undefined,
    voltaje_maximo_inversor: Number(product.voltaje_maximo_inversor) || undefined,
    // propiedades de módulo
    potencia_modulo: Number(product.potencia_modulo) || undefined,
    voc: Number(product.voc) || undefined,
    vmpp: Number(product.vmpp) || undefined,
    isc: Number(product.isc) || undefined,
    impp: Number(product.impp) || undefined,
    panel_area: Number(product.panel_area) || undefined,
    // propiedades de cableado
    fuente_electrica: product.fuente_electrica,
    // propiedades de estructura
    panel_array: Number(product.panel_array) || undefined,
    // propiedades de smart meter
    tipo_conexion_smartmeter: product.tipo_conexion_smartmeter,
    // Precios
    precio_soles: product.precio_soles,
    precio_dolares: product.precio_dolares,
    igv: product.igv / 100,
    // fechas
    created_at: product.created_at ? new Date(product.created_at) : new Date(),
    updated_at: product.updated_at ? new Date(product.updated_at) : new Date(),
    // estado de importación
    estado_equipo: product.estado_equipo || "",
    fecha_estimada_importacion:
      product.estado_equipo === "En importación" && product.fecha_estimada_importacion
        ? new Date(product.fecha_estimada_importacion)
        : null,
  };
}