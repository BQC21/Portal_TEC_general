import {
	headersFromColumns,
} from "@/lib/utils/helpers/massive/massiveUpload";
import { UploadColumn } from "@/lib/types/components/Massive/upload";

// ---- TEMPLATES

export const EQUIPOS_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "cod_prov", label: "COD PROV", kind: "text" },
	{ key: "proveedor", label: "PROVEEDOR", kind: "text" },
	{ key: "cod_producto", label: "COD PRODUCTO", kind: "text" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO", kind: "text" },
	{ key: "marca", label: "MARCA", kind: "text" },
	{ key: "descripcion", label: "DESCRIPCIÓN", kind: "text" },
	{ key: "unidad", label: "UNIDAD", kind: "text" },
	{ key: "tipo_de_conexion", label: "TIPO DE CONEXIÓN", kind: "text" },
	{ key: "potencia_maxima", label: "POTENCIA MÁXIMA", kind: "number" },
	{ key: "mppt", label: "# DE MPPT", kind: "number" },
	{ key: "cadenas", label: "# DE CADENAS", kind: "number" },
	{ key: "potencia_ac", label: "POTENCIA AC", kind: "number" },
	{ key: "dod", label: "DoD", kind: "number" },
	{ key: "vmpp_vmin", label: "VMPP/VMIN", kind: "number" },
	{ key: "voc_vmax", label: "VOC/VMAX", kind: "number" },
	{ key: "impp_i_in", label: "IMPP/I IN", kind: "text" },
	{ key: "isc_i_out", label: "ISC/I OUT", kind: "number" },
	{ key: "precio_soles", label: "PRECIO S/", kind: "number" },
	{ key: "precio_dolares", label: "PRECIO $", kind: "number" },
	{ key: "igv", label: "IGV", kind: "percent" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/", kind: "number" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $", kind: "number" },
];

export const MATERIALES_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "cod_prov", label: "COD PROV", kind: "text" },
	{ key: "proveedor", label: "PROVEEDOR", kind: "text" },
	{ key: "cod_producto", label: "COD PRODUCTO", kind: "text" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO", kind: "text" },
	{ key: "marca", label: "MARCA", kind: "text" },
	{ key: "descripcion", label: "DESCRIPCIÓN", kind: "text" },
	{ key: "parte_electrica", label: "PARTE ELÉCTRICA", kind: "text" },
	{ key: "unidad", label: "UNIDAD", kind: "text" },
	{ key: "precio_soles", label: "PRECIO S/", kind: "number" },
	{ key: "precio_dolares", label: "PRECIO $", kind: "number" },
	{ key: "igv", label: "IGV", kind: "percent" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/", kind: "number" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $", kind: "number" },
];

export const SUPPLIER_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "nombre", label: "Nombre del proveedor", kind: "text" },
	{ key: "codigo", label: "Código del proveedor", kind: "text" },
	{ key: "ruc", label: "RUC", kind: "text" },
	{ key: "contacto", label: "Nombre del contacto", kind: "text" },
	{ key: "telefono", label: "Teléfono", kind: "text" },
	{ key: "categoria", label: "Categoría", kind: "text" },
];

export const BRAND_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "nombre", label: "Nombre de la marca", kind: "text" },
	{ key: "categoria", label: "Categoría", kind: "text" },
	{ key: "proveedores", label: "Proveedores asociados", kind: "skip" },
];

export const TYPE_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "nombre", label: "Nombre del tipo de producto", kind: "text" },
	{ key: "categoria", label: "Categoría", kind: "text" },
	{ key: "marcas", label: "Marcas asociadas", kind: "skip" },
];

export const ZONE_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "zona", label: "Nombre de la zona", kind: "text" },
	{ key: "latitude", label: "Latitud", kind: "number" },
	{ key: "longitude", label: "Longitud", kind: "number" },
	{ key: "gti_respaldo", label: "GTI Anual (Inclinado)", kind: "number" },
	{ key: "gti_respaldo_diario", label: "GTI Diario (Inclinado)", kind: "number" },
	{ key: "ghi_respaldo", label: "GHI Anual (Coplanar)", kind: "number" },
	{ key: "ghi_respaldo_diario", label: "GHI Diario (Coplanar)", kind: "number" },
	{ key: "hsp_peor_mes", label: "HSP (Peor mes)", kind: "number" },
];

export const PROJECT_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "nombre", label: "Nombre del proyecto", kind: "text" },
	{ key: "zona", label: "Zona seleccionada", kind: "text" },
	{ key: "angulo", label: "Orientación del panel", kind: "text" },
	{ key: "tipo_instalacion", label: "Tipo de instalación", kind: "text" },
	{ key: "configuracion", label: "Configuración eléctrica", kind: "text" },
	{ key: "demanda_mensual", label: "Demanda eléctrica mensual", kind: "numberArray" },
	{ key: "demanda_electrica", label: "Demanda eléctrica anual", kind: "number" },
	{ key: "equipos", label: "Equipos principales seleccionados", kind: "skip" },
	{ key: "materiales", label: "Materiales eléctricos seleccionados", kind: "skip" },
	{ key: "enlace", label: "Enlace del proyecto", kind: "text" },
	{ key: "created_at", label: "Fecha creada", kind: "skip" },
	{ key: "updated_at", label: "Fecha actualizada", kind: "skip" },
	{ key: "estado_proyecto", label: "Estado del proyecto", kind: "text" },
];

export const QUOTE_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "cod_cotizacion", label: "Código de cotización", kind: "text" },
	{ key: "proyecto", label: "Proyecto asociado", kind: "skip" },
	{ key: "igv", label: "IGV", kind: "percent" },
	{ key: "tasa_cambio", label: "Tasa de cambio", kind: "number" },
	{ key: "precio_dolares", label: "Precio de venta ($)", kind: "currency" },
	{ key: "gm", label: "Gross Margin", kind: "number" },
	{ key: "depre_tool", label: "Depreciación por herramientas", kind: "number" },
	{ key: "created_at", label: "Creado", kind: "skip" },
	{ key: "updated_at", label: "Actualizado", kind: "skip" },
];

export const REPORT_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "cotizacion", label: "Cotización asociada", kind: "text" },
	{ key: "proyecto", label: "Proyecto asociado", kind: "skip" },
	{ key: "cliente", label: "Nombre del cliente", kind: "text" },
	{ key: "ruc_dni", label: "RUC del cliente", kind: "text" },
	{ key: "lugar", label: "Lugar de atención", kind: "text" },
	{ key: "atencion", label: "Encargado de atención", kind: "text" },
	{ key: "porcentaje_eqmt", label: "(%) Eq y Mat", kind: "number" },
	{ key: "porcentaje_inst", label: "(%) Instalación", kind: "number" },
	{ key: "precio_cotizacion", label: "Precio de cotización", kind: "currency" },
	{ key: "created_at", label: "Creado", kind: "skip" },
	{ key: "updated_at", label: "Actualizado", kind: "skip" },
];

export const FINANTIAL_UPLOAD_COLUMNS: UploadColumn[] = [
	{ key: "cotizacion", label: "Cotización asociada", kind: "text" },
	{ key: "proyecto", label: "Proyecto asociado", kind: "skip" },
	{ key: "planta", label: "Energía de la planta", kind: "number" },
	{ key: "generacion", label: "Generación 1er año", kind: "number" },
	{ key: "tarifa_red", label: "Tarifa red ($)", kind: "number" },
	{ key: "degra_1er", label: "Degradación 1er año (%)", kind: "number" },
	{ key: "degra_2do", label: "Degradación 2do año (%)", kind: "number" },
	{ key: "tarifa_crecimiento", label: "Incremento tarifa (%)", kind: "number" },
	{ key: "tasa_descuento", label: "Tasa descuento (%)", kind: "number" },
	{ key: "tiempo_retorno", label: "Tiempo de recuperación", kind: "text" },
	{ key: "lcoe", label: "LCOE", kind: "currency" },
	{ key: "created_at", label: "Creado", kind: "skip" },
	{ key: "updated_at", label: "Actualizado", kind: "skip" },
];

// ----- Encabezados para subida masiva

export const EQUIPOS_UPLOAD_HEADERS = headersFromColumns(EQUIPOS_UPLOAD_COLUMNS);
export const MATERIALES_UPLOAD_HEADERS = headersFromColumns(MATERIALES_UPLOAD_COLUMNS);
export const SUPPLIER_UPLOAD_HEADERS = headersFromColumns(SUPPLIER_UPLOAD_COLUMNS);
export const BRAND_UPLOAD_HEADERS = headersFromColumns(BRAND_UPLOAD_COLUMNS);
export const TYPE_UPLOAD_HEADERS = headersFromColumns(TYPE_UPLOAD_COLUMNS);
export const ZONE_UPLOAD_HEADERS = headersFromColumns(ZONE_UPLOAD_COLUMNS);
export const PROJECT_UPLOAD_HEADERS = headersFromColumns(PROJECT_UPLOAD_COLUMNS);
export const QUOTE_UPLOAD_HEADERS = headersFromColumns(QUOTE_UPLOAD_COLUMNS);
export const REPORT_UPLOAD_HEADERS = headersFromColumns(REPORT_UPLOAD_COLUMNS);
export const FINANTIAL_UPLOAD_HEADERS = headersFromColumns(FINANTIAL_UPLOAD_COLUMNS);

