import type { 
	Product,
	ProductFormState,
} from "@/lib/types/product-types";

export function normalizeCurrencyCode(value: unknown): "PEN" | "USD" {
	if (value === "USD" || value === "PEN") {
		return value;
	}

		return "PEN";
}

export function parseNullableDate(value: Date | string | null | undefined): Date | null {
	if (!value) return null;

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

// Formato de fecha
export function formatDate(value: unknown) {
    if (!value) return "-";

    const date = value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-PE");
}

export function getCurrentDate(): Date {
    return new Date();
}

// Opciones para el sorting
export const SORTING_OPTIONS = {
	asc: "Ascendente",
	desc: "Descendente",
} as const;

// Opciones para el filtrado y los modals (add y edit)
export const SUPPLIER_OPTIONS = [
	"Andet S.A.C",
	"Sigelec S.A.C",
	"AutoSolar Energía del Perú S.A.C",
	"Novum Solar S.A.C",
	"Caral Soluciones Energéticas S.A.C",
	"Felicitysolar Peru E.I.R.L",
	"RE & GE Import S.A.C",
	"Grupo Coinp S.A.C",
	"Proyect & Quality S.A.C",
];
export const RUC_OPTIONS = [
	"20601248647",
	"20268214527",
	"20602492118",
	"20601873894",
	"20603087675",
	"20611054069",
	"20502234693",
	"20548407991",
	"20611896116",
]
export const SUPPLIER_CODE_OPTIONS = [
	"ANDE", 
	"SIGE", 
	"AUTO", 
	"NOVU", 
	"CARA", 
	"FELI", 
	"REGE", 
	"COIN", 
	"PROY"
];
export const PRODUCT_TYPE_OPTIONS = [
	"Accesorio",
	"Batería",
	"Controlador",
	"Convertidor",
	"Datalogger",
	"Estructura",
	"Inversor",
	"Módulo",
	"Monitor",
	"Rack",
	"Smart Meter",
	"Cable",
	"Protección",
	"MC4",
	"Tablero",
	"CT",
	"Fusible",
	"Portafusible",
];
export const BRAND_OPTIONS = [
	"LIVOLTEK",
	"GOODWE",
	"JA SOLAR",
	"INVT",
	"PYLONTECH",
	"VICTRON",
	"TELPERION",
	"JINKO",
	"SOLIS",
	"SOLUNA",
	"TRINA",
	"FELICITY",
	"SUNTREE",
	"TIBOX",
	"CHINT",
	"INDECO",
	"SCHNEIDER",
	"TENSITE",
	"ABB",
];
export const STATUS_OPTIONS = [
	"En stock",
	"En importación",
	"Descontinuado",
]
export const UNIT_OPTIONS = ["Unidad", "Metros"];
export const CONNECTION_TYPE_OPTIONS = ["---", "1F 220V", "3F 220V", "3F 380V", "1F", "3F"];
export const POWER_SOURCE_OPTIONS = ["---", "DC", "AC", "DC/AC", "BAT"];
export const PRICE_CURRENCY_OPTIONS = ["USD", "PEN"] as const;

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
	priceInputCurrency: PRICE_CURRENCY_OPTIONS[0],
	pricePen: 0,
	priceUsd: 0,
	igv: 18,
	precio_soles_igv: 0,
	precio_dolares_igv: 0,
	fecha_creada: new Date(),
	fecha_actualizada: new Date(),
    fecha_estimada_importacion: null,
    estado_equipo: STATUS_OPTIONS[0],
};

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
		priceInputCurrency: product.priceInputCurrency,
		pricePen: product.pricePen,
		priceUsd: product.priceUsd,
		igv: product.igv,
		precio_soles_igv: product.precio_soles_igv,
		precio_dolares_igv: product.precio_dolares_igv,
		fecha_creada: product.fecha_creada,
		fecha_actualizada: product.fecha_actualizada,
		fecha_estimada_importacion: product.estado_equipo === "En importación" ? product.fecha_estimada_importacion : null,
		estado_equipo: product.estado_equipo,
	};
}

// Exchange rates compute and operation to obtain prices with IGV
export function formatReadonlyCurrency(symbol: string, value: number) {
	return `${symbol} ${value.toFixed(2)}`;
}
export function convertPenToUsd(pricePen: number, exchangeRate: number): number {
	return pricePen / exchangeRate;
}
export function convertUsdToPen(priceUsd: number, exchangeRate: number): number {
	return priceUsd * exchangeRate;
}
export function computePricesWithIgv(pricePen: number, priceUsd: number, igvPercent: number) {
	const igvFactor = 1 + igvPercent / 100;

	return {
		pricePen,
		priceUsd,
		totalPen: pricePen * igvFactor,
		totalUsd: priceUsd * igvFactor,
	};
}