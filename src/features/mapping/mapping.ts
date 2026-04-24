import { Product, ProductFormData, ProductFormState, SupabaseProductRow } from "@/lib/types/product-types";
import { parseNullableDate, normalizeCurrencyCode } from "@/lib/utils/helpers"

// enlace con los atributos de Supabase
export function createProductFormStateFromProduct(product: Product): ProductFormState {
	return {
		ruc: product.ruc,
		supplier: product.supplier,
		supplierCode: product.supplierCode,
		code: product.code,
		type: product.type,
		brand: product.brand,
		unit: product.unit,
		description: product.description,
    // especificaciones técnicas
		connectionType: product.connectionType,
		maxPower: product.maxPower,
		mpptNumber: product.mpptNumber,
		dod: product.dod,
		arraysPerMppt: product.arraysPerMppt,
		potenciaAC: product.potenciaAC,
		voc: product.voc,
		vmpp: product.vmpp,
		isc: product.isc,
		impp: product.impp,
		powerSource: product.powerSource,
		beta_percent: product.beta_percent,
		panel_array: product.panel_array,
		panel_area: product.panel_area,
    // precios
		priceInputCurrency: product.priceInputCurrency,
		pricePen: product.pricePen,
		priceUsd: product.priceUsd,
		igv: product.igv,
		precio_soles_igv: product.precio_soles_igv,
		precio_dolares_igv: product.precio_dolares_igv,
    // fechas
		fecha_creada: product.fecha_creada,
		fecha_actualizada: product.fecha_actualizada,
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
    id: row.id?.toString() || "",
    ruc: row.ruc || "",
    supplierCode: row.cod_prov || "",
    supplier: row.proveedor || "",
    code: row.codigo || "",
    type: row.tipo || "",
    brand: row.marca || "",
    unit: row.unidad || "",
    description: row.descripcion || "",
    // especificaciones técnicas
    connectionType: row.tipo_conexion || "",
    maxPower: row.pot_maxima?.toString() || "",
    mpptNumber: row.mppt?.toString() || "",
    dod: row.dod?.toString() || "",
    beta_percent: row.beta_percent?.toString() || "",
    arraysPerMppt: row.array_mppt?.toString() || "",
    potenciaAC: (row.potenciaAC ?? row.potencia_ac)?.toString() || "",
    voc: row.voc?.toString() || "",
    vmpp: row.vmpp?.toString() || "",
    isc: row.isc?.toString() || "",
    impp: row.impp?.toString() || "",
    powerSource: row.fuente_electrica || row.power_source || "",
    panel_array: row.panel_array?.toString() || " ",
    panel_area: row.panel_area?.toString() || " ",
    // currency source naming
    priceInputCurrency: normalizeCurrencyCode(
      row.priceInputCurrency
        ?? row.price_input_currency
        ?? row.fuente_divisas
        ?? row.fuente_divisa
        ?? row.currency_source
        ?? row.moneda
    ),
    // Precios
    pricePen: row.precio_soles || 0,
    priceUsd: row.precio_dolares || 0,
    igv: row.igv ? row.igv * 100 : 0,
    precio_soles_igv: row.precio_soles_igv || 0,
    precio_dolares_igv: row.precio_dolares_igv || 0,
    // fechas
    fecha_creada: parseNullableDate(row.created_at) ?? new Date(),
    fecha_actualizada: parseNullableDate(row.updated_at) ?? new Date(),
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
    ruc: product.ruc || "",
    cod_prov: product.supplierCode,
    proveedor: product.supplier,
    codigo: product.code,
    tipo: product.type,
    marca: product.brand,
    unidad: product.unit,
    descripcion: product.description,
    tipo_conexion: product.connectionType,
    // especificaciones técnicas
    pot_maxima: Number(product.maxPower) || undefined,
    mppt: Number(product.mpptNumber) || undefined,
    dod: Number(product.dod) || undefined,
    beta_percent: Number(product.beta_percent) || undefined,
    array_mppt: Number(product.arraysPerMppt) || undefined,
    potenciaAC: Number(product.potenciaAC) || undefined,
    voc: Number(product.voc) || undefined,
    vmpp: Number(product.vmpp) || undefined,
    isc: Number(product.isc) || undefined,
    impp: Number(product.impp) || undefined,
    fuente_electrica: product.powerSource,
    panel_array: Number(product.panel_array) || undefined,
    panel_area: Number(product.panel_area) || undefined,
    // Precios
    precio_soles: product.pricePen,
    precio_dolares: product.priceUsd,
    igv: product.igv / 100,
    // fechas
    created_at: product.fecha_creada ? new Date(product.fecha_creada) : new Date(),
    updated_at: product.fecha_actualizada ? new Date(product.fecha_actualizada) : new Date(),
    // estado de importación
    estado_equipo: product.estado_equipo || "",
    fecha_estimada_importacion:
      product.estado_equipo === "En importación" && product.fecha_estimada_importacion
        ? new Date(product.fecha_estimada_importacion)
        : null,
  };
}