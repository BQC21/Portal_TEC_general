export type ExportCellValue = string | number | null;

export type ExportColumn<T> = {
	key: keyof T;
	label: string;
};

export type DownloadFormat = "xlsx" | "csv";

export type RowWithId = { id: string | number };

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
	angulo: string;
	tipo_instalacion: string;
	configuracion: string;
	demanda_mensual: number[];
	demanda_electrica: number;
	equipos: string;
	materiales: string;
	enlace: string;
	created_at: string;
	updated_at: string;
	estado_proyecto: string;
};

export type QuoteExportRow = {
	cod_cotizacion: string;
	proyecto: string;
	igv: string;
	tasa_cambio: string;
	precio_dolares: string;
	gm: number;
	depre_tool: number;
	created_at: string;
	updated_at: string;
};

export type ReportExportRow = {
	cotizacion: string;
	proyecto: string;
	cliente: string;
	ruc_dni: string;
	lugar: string;
	atencion: string;
	porcentaje_eqmt: string;
	porcentaje_inst: string;
	precio_cotizacion: string;
	created_at: string;
	updated_at: string;
};

export type FinantialExportRow = {
	cotizacion: string;
	proyecto: string;
	planta: number;
	generacion: number;
	tarifa_red: number;
	degra_1er: number;
	degra_2do: number;
	tarifa_crecimiento: number;
	tasa_descuento: number;
	tiempo_retorno: string;
	lcoe: string;
	created_at: string;
	updated_at: string;
};
