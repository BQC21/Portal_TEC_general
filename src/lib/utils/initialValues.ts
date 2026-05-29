import type { 
	// Product,
	ProductFormState,
} from "@/lib/types/product-types";

import type {
    // Equipos,
    EquiposFormState,
} from "@/lib/types/equipos-types";

import type {
    // Materiales,
    MaterialesFormState,
} from "@/lib/types/materiales-types";

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
    STATUS_PROJECT_OPTIONS
} from "@/lib/utils/options"
import { ZoneFormState } from "../types/zone-types";
import { ProjectFormState } from "../types/project-types";

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
    voltaje_minimo_inversor: "",
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

// valores iniciales para el estado de form de productos
export const INITIAL_EQUIPOS_FORM: EquiposFormState = {
    // propiedades generales
    cod_prov: SUPPLIER_CODE_OPTIONS[0],
    proveedor: SUPPLIER_OPTIONS[0],
    cod_producto: "",
    tipo_de_producto: PRODUCT_TYPE_OPTIONS[0],
    marca: BRAND_OPTIONS[0],
    descripcion: "",
    // propiedades eléctricas
    tipo_conexion: CONNECTION_TYPE_OPTIONS[0],
    potencia_maxima: 0,
    mppt_dod: 0,
    potencia_ac: 0,
    voc_vmax: 0,
    vmpp_vmin: 0,
    isc_imax_in: "20/20",
    impp_imax_out: 0,
    // precios
    unidad: UNIT_OPTIONS[0],
    precio_soles: 0,
    precio_dolares: 0,
    igv: 18,
    precio_soles_igv: 0,
    precio_dolares_igv: 0,
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
};

// valores iniciales para el estado de form de productos
export const INITIAL_MATERIALES_FORM: MaterialesFormState = {
    // propiedades generales
    cod_prov: SUPPLIER_CODE_OPTIONS[0],
    proveedor: SUPPLIER_OPTIONS[0],
    cod_producto: "",
    tipo_de_producto: PRODUCT_TYPE_OPTIONS[0],
    marca: BRAND_OPTIONS[0],
    descripcion: "",
    // propiedades cableado
    parte_electrica: POWER_SOURCE_OPTIONS[0],
    // precios
    unidad: UNIT_OPTIONS[0],
    precio_soles: 0,
    precio_dolares: 0,
    igv: 18,
    precio_soles_igv: 0,
    precio_dolares_igv: 0,
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
};

// valores iniciales para el estado de form de proyectos
export const INITIAL_PROJECT_FORM: ProjectFormState = {
    // propiedades generales
    nombre: "",
    descripcion: "",
    zona_id: "",     
    zona_info: undefined,           
    // cálculos de radiación
    hsp: "",
    ghi: "",
    // inputs generales
    demanda_electrica:  "",
    tipo_conexion:  "",
    cobertura_porcentaje:  "",
    rendimiento_modulo_porcentaje:  "",
    relacion_dc_ac:  "",
    // cálculos de requerimientos
    energia_requerida:  "",
    potencia_dc_requerida:  "",
    potencia_ac_requerida:  "",
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
    // estado
    estado_proyecto: STATUS_PROJECT_OPTIONS[0],
}

// valores iniciales para el estado de form de zonas
export const INITIAL_ZONE_FORM: ZoneFormState = {
    // propiedades generales
    zona: "",        
    // cálculos de radiación
    latitude: "",
    longitude: "",
    ghi_respaldo: "",
    ghi_respaldo_diario: "",
    gti_respaldo: "",
    gti_respaldo_diario: "",
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
}