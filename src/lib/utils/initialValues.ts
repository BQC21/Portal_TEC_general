import type { 
	Product,
	ProductFormState,
} from "@/lib/types/product-types";

import {
	SORTING_OPTIONS,
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
    ruc: RUC_OPTIONS[0],
    supplier: SUPPLIER_OPTIONS[0],
    supplierCode: SUPPLIER_CODE_OPTIONS[0],
    code: "",
    type: PRODUCT_TYPE_OPTIONS[0],
    brand: BRAND_OPTIONS[0],
    unit: UNIT_OPTIONS[0],
    description: "",
    // especificaciones técnicas
    connectionType: CONNECTION_TYPE_OPTIONS[0],
    maxPower: "",
    mpptNumber: "",
    dod: "",
    arraysPerMppt: "",
    potenciaAC: "",
    voc: "",
    vmpp: "",
    isc: "",
    impp: "",
    powerSource: POWER_SOURCE_OPTIONS[0],
    beta_percent: "",
    // precios
    priceInputCurrency: PRICE_CURRENCY_OPTIONS[0],
    pricePen: 0,
    priceUsd: 0,
    igv: 18,
    precio_soles_igv: 0,
    precio_dolares_igv: 0,
    // fechas
    fecha_creada: new Date(),
    fecha_actualizada: new Date(),
    // estado de importación
    estado_equipo: STATUS_OPTIONS[0],
    fecha_estimada_importacion: null,
};