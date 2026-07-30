import { FilterKey } from "@/lib/utils/options";

export type FilterableItem = {
	proveedor: string;
	marca: string;
	tipo_de_producto: string;
};

export type CascadeFilterValues = Record<FilterKey, string>;

export type FormCascadeValues = {
	proveedor: string;
	marca: string;
	tipo_de_producto: string;
};

export type FormCascadeField = keyof FormCascadeValues;

export const FORM_FIELD_TO_FILTER_KEY: Record<FormCascadeField, FilterKey> = {
	proveedor: "supplier",
	marca: "brand",
	tipo_de_producto: "type",
};

export const CASCADE_SELECT_PLACEHOLDER = { value: "", label: "Seleccionar..." };