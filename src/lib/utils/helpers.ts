import type { Product } from "@/features/types/product-types";

export type ProductFormState = Omit<Product, "id">;

export const SUPPLIER_OPTIONS = [
	"Andet SAC",
	"Sigelet SAC",
	"AutoSolar SAC",
	"Novum Solar SAC",
	"Caral Energía SAC",
	"Felicity SAC",
	"RE&GE Import",
	"Grupo Coinp",
	"Proyect and Quality",
];

export const SUPPLIER_CODE_OPTIONS = ["ANDE", "SIGE", "AUTO", "NOVU", "CARA", 
										"FELI", "REGE", "COIN", "PROY"];

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
	"Smart Meter",
	"Cable",
	"Protección",
	"MC4",
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
	"ABB",
];

export const UNIT_OPTIONS = ["Unidad", "Metros"];

export const CONNECTION_TYPE_OPTIONS = ["1F 220V", "3F 220V", "3F 380V", "1F", "3F"];

export const POWER_SOURCE_OPTIONS = ["DC", "AC", "DC/AC", "BAT"];

export const INITIAL_PRODUCT_FORM: ProductFormState = {
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
	voc: "",
	vmpp: "",
	isc: "",
	impp: "",
	powerSource: "",
	priceInputCurrency: "PEN",
	pricePen: 0,
	priceUsd: 0,
	igv: 18,
	precio_soles_igv: 0,
	precio_dolares_igv: 0,
};

export function createProductFormStateFromProduct(product: Product): ProductFormState {
	return {
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
		voc: product.voc,
		vmpp: product.vmpp,
		isc: product.isc,
		impp: product.impp,
		powerSource: product.powerSource,
		priceInputCurrency: product.priceInputCurrency,
		pricePen: product.pricePen,
		priceUsd: product.priceUsd,
		igv: product.igv,
		precio_soles_igv: product.precio_soles_igv,
		precio_dolares_igv: product.precio_dolares_igv,
	};
}

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