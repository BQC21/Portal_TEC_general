import { Equipos } from "@/lib/types/supabase/equipos-types";
import { Materiales } from "@/lib/types/supabase/materiales-types";

export type ExportColumn<T> = {
	key: keyof T;
	label: string;
};

// -------------------
// ----- M1 ----------
// -------------------

export const EQUIPOS_EXPORT_COLUMNS: ExportColumn<Equipos>[] = [
	{ key: "cod_prov", label: "COD PROV" },
	{ key: "proveedor", label: "PROVEEDOR" },
	{ key: "cod_producto", label: "COD PRODUCTO" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO" },
	{ key: "marca", label: "MARCA" },
	{ key: "descripcion", label: "DESCRIPCIÓN" },
	{ key: "unidad", label: "UNIDAD" },
	{ key: "tipo_conexion", label: "TIPO DE CONEXIÓN" },
	{ key: "potencia_maxima", label: "POTENCIA MÁXIMA" },
	{ key: "mppt", label: "# DE MPPT" },
	{ key: "cadenas", label: "# DE CADENAS" },
	{ key: "potencia_ac", label: "POTENCIA AC" },
	{ key: "dod", label: "DoD" },
	{ key: "vmpp_vmin", label: "VMPP/VMIN" },
	{ key: "voc_vmax", label: "VOC/VMAX" },
	{ key: "impp_i_in", label: "IMPP/I IN" },
	{ key: "isc_i_out", label: "ISC/I OUT" },
	{ key: "precio_soles", label: "PRECIO S/" },
	{ key: "precio_dolares", label: "PRECIO $" },
	{ key: "igv", label: "IGV" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $" },
];

export const MATERIALES_EXPORT_COLUMNS: ExportColumn<Materiales>[] = [
	{ key: "cod_prov", label: "COD PROV" },
	{ key: "proveedor", label: "PROVEEDOR" },
	{ key: "cod_producto", label: "COD PRODUCTO" },
	{ key: "tipo_de_producto", label: "TIPO DE PRODUCTO" },
	{ key: "marca", label: "MARCA" },
	{ key: "descripcion", label: "DESCRIPCIÓN" },
	{ key: "parte_electrica", label: "PARTE ELÉCTRICA" },
	{ key: "unidad", label: "UNIDAD" },
	{ key: "precio_soles", label: "PRECIO S/" },
	{ key: "precio_dolares", label: "PRECIO $" },
	{ key: "igv", label: "IGV" },
	{ key: "precio_soles_igv", label: "PRECIO + IGV S/" },
	{ key: "precio_dolares_igv", label: "PRECIO + IGV $" },
];

export type SupplierExportRow = {
	nombre: string;
	codigo: string;
	ruc: string;
	contacto: string;
	telefono: string;
	categoria: string;
};

export type BrandExportRow = {
	nombre: string;
	categoria: string;
	proveedores: string;
};

export type TypeExportRow = {
	nombre: string;
	categoria: string;
	marcas: string;
};

export const SUPPLIER_EXPORT_COLUMNS: ExportColumn<SupplierExportRow>[] = [
	{ key: "nombre", label: "Nombre del proveedor" },
	{ key: "codigo", label: "Código del proveedor" },
	{ key: "ruc", label: "RUC" },
	{ key: "contacto", label: "Nombre del contacto" },
	{ key: "telefono", label: "Teléfono" },
	{ key: "categoria", label: "Categoría" },
];

export const BRAND_EXPORT_COLUMNS: ExportColumn<BrandExportRow>[] = [
	{ key: "nombre", label: "Nombre de la marca" },
	{ key: "categoria", label: "Categoría" },
	{ key: "proveedores", label: "Proveedores asociados" },
];

export const TYPE_EXPORT_COLUMNS: ExportColumn<TypeExportRow>[] = [
	{ key: "nombre", label: "Nombre del tipo de producto" },
	{ key: "categoria", label: "Categoría" },
	{ key: "marcas", label: "Marcas asociadas" },
];

// -------------------
// ----- M2 ----------
// -------------------

export type ZoneExportRow = {
	zona: string;
	latitude: string;
	longitude: string;
	gti_respaldo: string;
	gti_respaldo_diario: string;
	ghi_respaldo: string;
	ghi_respaldo_diario: string;
	hsp_peor_mes: string;
};

export type ProjectExportRow = {
	nombre: string;
	zona: string;
	tipo_instalacion: string;
	equipos: string;
	materiales: string;
	enlace: string;
	created_at: string;
	updated_at: string;
	estado_proyecto: string;
};

export const ZONE_EXPORT_COLUMNS: ExportColumn<ZoneExportRow>[] = [
	{ key: "zona", label: "Nombre de la zona" },
	{ key: "latitude", label: "Latitud" },
	{ key: "longitude", label: "Longitud" },
	{ key: "gti_respaldo", label: "GTI Anual (Inclinado)" },
	{ key: "gti_respaldo_diario", label: "GTI Diario (Inclinado)" },
	{ key: "ghi_respaldo", label: "GHI Anual (Coplanar)" },
	{ key: "ghi_respaldo_diario", label: "GHI Diario (Coplanar)" },
	{ key: "hsp_peor_mes", label: "HSP (Peor mes)" },
];

export const PROJECT_EXPORT_COLUMNS: ExportColumn<ProjectExportRow>[] = [
	{ key: "nombre", label: "Nombre del proyecto" },
	{ key: "zona", label: "Zona seleccionada" },
	{ key: "tipo_instalacion", label: "Tipo de instalación" },
	{ key: "equipos", label: "Equipos principales seleccionados" },
	{ key: "materiales", label: "Materiales eléctricos seleccionados" },
	{ key: "enlace", label: "Enlace del proyecto" },
	{ key: "created_at", label: "Fecha creada" },
	{ key: "updated_at", label: "Fecha actualizada" },
	{ key: "estado_proyecto", label: "Estado del proyecto" },
];




// -------------------
// ----- M3 ----------
// -------------------

export type QuoteExportRow = {
	cod_cotizacion: string;
	proyecto: string;
	igv: string;
	tasa_cambio: string;
	precio_dolares: string;
	created_at: string;
	updated_at: string;
};

export type ReportExportRow = {
	cotizacion: string;
	proyecto: string;
	cliente: string;
	porcentaje_eqmt: string;
	porcentaje_inst: string;
	precio_cotizacion: string;
	created_at: string;
	updated_at: string;
};

export type FinantialExportRow = {
	cotizacion: string;
	proyecto: string;
	tiempo_retorno: string;
	lcoe: string;
	created_at: string;
	updated_at: string;
};

export const QUOTE_EXPORT_COLUMNS: ExportColumn<QuoteExportRow>[] = [
	{ key: "cod_cotizacion", label: "Código de cotización" },
	{ key: "proyecto", label: "Proyecto asociado" },
	{ key: "igv", label: "IGV" },
	{ key: "tasa_cambio", label: "Tasa de cambio" },
	{ key: "precio_dolares", label: "Precio de venta ($)" },
	{ key: "created_at", label: "Creado" },
	{ key: "updated_at", label: "Actualizado" },
];

export const REPORT_EXPORT_COLUMNS: ExportColumn<ReportExportRow>[] = [
	{ key: "cotizacion", label: "Cotización asociada" },
	{ key: "proyecto", label: "Proyecto asociado" },
	{ key: "cliente", label: "Nombre del cliente" },
	{ key: "porcentaje_eqmt", label: "(%) Eq y Mat" },
	{ key: "porcentaje_inst", label: "(%) Instalación" },
	{ key: "precio_cotizacion", label: "Precio de cotización" },
	{ key: "created_at", label: "Creado" },
	{ key: "updated_at", label: "Actualizado" },
];

export const FINANTIAL_EXPORT_COLUMNS: ExportColumn<FinantialExportRow>[] = [
	{ key: "cotizacion", label: "Cotización asociada" },
	{ key: "proyecto", label: "Proyecto asociado" },
	{ key: "tiempo_retorno", label: "Tiempo de recuperación" },
	{ key: "lcoe", label: "LCOE" },
	{ key: "created_at", label: "Creado" },
	{ key: "updated_at", label: "Actualizado" },
];
