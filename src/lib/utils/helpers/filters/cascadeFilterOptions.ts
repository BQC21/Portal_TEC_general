import type { FilterKey } from "@/lib/utils/options";

type FilterableItem = {
	proveedor: string;
	marca: string;
	tipo_de_producto: string;
};

type CascadeFilterValues = Record<FilterKey, string>;

function getDistinctValues<T extends FilterableItem>(
	items: T[],
	field: keyof FilterableItem,
): string[] {
	return Array.from(
		new Set(items.map((item) => item[field]).filter(Boolean)),
	).sort((a, b) => a.localeCompare(b, "es"));
}

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

export function getSupplierOptions<T extends FilterableItem>(items: T[]): string[] {
	return getDistinctValues(items, "proveedor");
}

export function getBrandOptions<T extends FilterableItem>(
	items: T[],
	supplier?: string,
): string[] {
	const subset = filterItemsBySelections(items, supplier);
	return getDistinctValues(subset, "marca");
}

export function getTypeOptions<T extends FilterableItem>(
	items: T[],
	supplier?: string,
	brand?: string,
): string[] {
	const subset = filterItemsBySelections(items, supplier, brand);
	return getDistinctValues(subset, "tipo_de_producto");
}

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
