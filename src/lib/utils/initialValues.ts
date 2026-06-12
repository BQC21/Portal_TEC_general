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
    STATUS_PROJECT_OPTIONS,
    EQUIPOS_TYPE_OPTIONS,
    MATERIALES_TYPE_OPTIONS
} from "@/lib/utils/options"
import { ZoneFormState } from "../types/zone-types";
import { ProjectFormState } from "../types/project-types";
import { Project_EquiposFormState } from "../types/project_equipos_join";
import { Project_MaterialesFormState } from "../types/project_materiales_join";

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
    tipo_de_producto: EQUIPOS_TYPE_OPTIONS[0],
    marca: BRAND_OPTIONS[0],
    descripcion: "",
    // propiedades eléctricas
    tipo_conexion: CONNECTION_TYPE_OPTIONS[0],
    potencia_maxima: 0,
    mppt: 0,
    potencia_ac: 0,
    dod: 0,
    vmpp_vmin: 0,
    voc_vmax: 0,
    impp_i_in: "40/40/20",
    isc_i_out: 0,
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
    tipo_de_producto: MATERIALES_TYPE_OPTIONS[0],
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
    tipo_instalacion:  "",       
    // cálculos de radiación
    hsp: "",
    ghi: "",
    // datos del sistema
    demanda_electrica:  "",
    configuracion:  "",
    cobertura_porcentaje:  "",
    rendimiento_modulo_porcentaje:  "",
    // requerimientos energéticos
    energia_requerida:  "",
    potencia_dc_requerida:  "",
    potencia_ac_requerida:  "",
    // campo fotovoltaico
    strings_min:  "",
    strings_max:  "",
    strings:  "",
    // protecciones eléctricas
    itm_ac_min:  "",
    itm_dc_min:  "",
    spd_voltage:  "",
    mppt_number: "",
    // almacenamiento energético
    autonomía: "",
    ah_sistema: "",
    num_baterias: "",
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
    // estado
    estado_proyecto: STATUS_PROJECT_OPTIONS[0],
    // enlace
    enlace: ""
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
    hsp_peor_mes: "",
    // fechas
    created_at: new Date(),
    updated_at: new Date(),
}

export const INITIAL_PROJECT_EQUIPO_FORM: Project_EquiposFormState = {
    equipo_id: "",
    equipo_info: undefined,
    proyecto_id: "",
    proyecto_info: undefined,
    fecha_agregado: new Date(),
    cantidad: ""
} 

export const INITIAL_PROJECT_MATERIAL_FORM: Project_MaterialesFormState = {
    material_id: "",
    material_info: undefined,
    proyecto_id: "",
    proyecto_info: undefined,
    fecha_agregado: new Date(),
    cantidad: ""
} 