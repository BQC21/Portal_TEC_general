import type { 
	// Product,
	ProductFormState,
} from "@/lib/types/product-types";

import {
	// SORTING_OPTIONS,
	SUPPLIER_OPTIONS,
	RUC_OPTIONS,
	SUPPLIER_CODE_OPTIONS,
	PRODUCT_TYPE_OPTIONS,
	BRAND_OPTIONS,
	UNIT_OPTIONS,
	CONNECTION_TYPE_OPTIONS,
	POWER_SOURCE_OPTIONS,
	PRICE_CURRENCY_OPTIONS,
	STATUS_OPTIONS,
} from "@/lib/utils/options"

// valores iniciales para el estado de form de productos
export const INITIAL_PRODUCT_FORM: ProductFormState = {
    // propiedades generales
    ruc: RUC_OPTIONS[0],
    proveedor: SUPPLIER_OPTIONS[0],
    cod_prov: SUPPLIER_CODE_OPTIONS[0],
    codigo: "",
    tipo: PRODUCT_TYPE_OPTIONS[0],
    marca: BRAND_OPTIONS[0],
    unidad: UNIT_OPTIONS[0],
    descripcion: "",
    // propiedades bateria
    tipo_conexion_bateria: CONNECTION_TYPE_OPTIONS[0],
    dod: "",
    amperaje_bateria: "",
    voltaje_bateria: "",
    // propiedades estructura
    panel_array: "",
    // propiedades inversor
    tipo_conexion_inversor: CONNECTION_TYPE_OPTIONS[0],
    potencia_dc_inversor: "",
    potencia_ac_inversor: "",
    mppt: "",
    i_entrada_inversor: "",
    i_salida_inversor: "",
    voltaje_maximo_inversor: "",
    // propiedades modulo
    potencia_modulo: "",
    voc: "",
    vmpp: "",
    isc: "",
    impp: "",
    panel_area: "",
    // propiedades smart meter
    tipo_conexion_smartmeter: CONNECTION_TYPE_OPTIONS[0],
    // propiedades cableado
    fuente_electrica: POWER_SOURCE_OPTIONS[0],
    // precios
    priceInputCurrency: PRICE_CURRENCY_OPTIONS[0],
    precio_soles: 0,
    precio_dolares: 0,
    igv: 18,
    precio_soles_igv: 0,
    precio_dolares_igv: 0,
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
    // estado de importación
    estado_equipo: STATUS_OPTIONS[0],
    fecha_estimada_importacion: null,
};