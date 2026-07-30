import { CASCADE_SELECT_PLACEHOLDER, CascadeFilterValues, FilterableItem, 
	FORM_FIELD_TO_FILTER_KEY, FormCascadeField, FormCascadeValues } from "@/lib/types/components/cascadeFilter";
import type { FilterKey } from "@/lib/utils/options";

// Distintos valores
function getDistinctValues<T extends FilterableItem>(
	items: T[],
	field: keyof FilterableItem,
): string[] {
	return Array.from(
		new Set(items.map((item) => item[field]).filter(Boolean)),
	).sort((a, b) => a.localeCompare(b, "es"));
}

// Proveedores filtrados y marcas filtradas
function filterItemsBySelections<T extends FilterableItem>(
	items: T[],
	supplier?: string,
	brand?: string,
): T[] {
	return items.filter((item) => {
		const matchesSupplier = !supplier || item.proveedor === supplier;
		const matchesBrand = !brand || item.marca === brand;
		return matchesSupplier && matchesBrand;
	});
}

////////////////////////////////////////////////////////////////////

// Obtener proveedores filtradas
export function getSupplierOptions<T extends FilterableItem>(items: T[]): string[] {
	return getDistinctValues(items, "proveedor");
}
// Obtener marcas filtradas
export function getBrandOptions<T extends FilterableItem>(
	items: T[],
	supplier?: string,
): string[] {
	const subset = filterItemsBySelections(items, supplier);
	return getDistinctValues(subset, "marca");
}
// Obtener tipos filtrados
export function getTypeOptions<T extends FilterableItem>(
	items: T[],
	supplier?: string,
	brand?: string,
): string[] {
	const subset = filterItemsBySelections(items, supplier, brand);
	return getDistinctValues(subset, "tipo_de_producto");
}


/////////////////////////////////////////

// Filtrado en cascada (siguiente valor)
export function resolveCascadeFilters<T extends FilterableItem>(
	items: T[],
	current: CascadeFilterValues,
	key: FilterKey,
	value: string,
): CascadeFilterValues {
	const next = { ...current, [key]: value };

	if (key === "supplier" || key === "brand") {
		const brands = getBrandOptions(items, next.supplier);
		if (next.brand && !brands.includes(next.brand)) {
			next.brand = "";
		}
	}

	const types = getTypeOptions(items, next.supplier, next.brand);
	if (next.type && !types.includes(next.type)) {
		next.type = "";
	}

	return next;
}
// Filtrado en cascada (nombres de formulario)
export function resolveFormCascadeFilters<T extends FilterableItem>(
	items: T[],
	current: FormCascadeValues,
	field: FormCascadeField,
	value: string,
): FormCascadeValues {
	const filterKey = FORM_FIELD_TO_FILTER_KEY[field];
	const filters: CascadeFilterValues = {
		supplier: current.proveedor,
		brand: current.marca,
		type: current.tipo_de_producto,
	};
	const resolved = resolveCascadeFilters(items, filters, filterKey, value);

	return {
		proveedor: resolved.supplier,
		marca: resolved.brand,
		tipo_de_producto: resolved.type,
	};
}
// Devuelve la lista de proveedores, marcas y tipos según lo seleccionado
export function getModalCascadeOptions<T extends FilterableItem>(
	items: T[],
	proveedor: string,
	marca: string,
) {
	return {
		suppliers: getSupplierOptions(items),
		brands: proveedor ? getBrandOptions(items, proveedor) : [],
		types: proveedor && marca ? getTypeOptions(items, proveedor, marca) : [],
	};
}
// Array de opciones anteponiendo "Seleccionar ..."
export function withCascadePlaceholder(options: string[]) {
	return [
		CASCADE_SELECT_PLACEHOLDER,
		...options.map((option) => ({ value: option, label: option })),
	];
}
