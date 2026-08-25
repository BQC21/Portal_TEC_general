import { CascadeFilterValues, FilterableItem } from "@/lib/types/components/Filter/cascadeFilter";
import { CascadeFilterOptions } from "@/lib/types/components/Filter/filter_tables";
import { ProductCategoryFilter } from "@/lib/types/components/sub_components/module_render";
import { Brand } from "@/lib/types/supabase/brand.types";
import { Supplier } from "@/lib/types/supabase/supplier-types";
import { Type } from "@/lib/types/supabase/type-types";
import { FilterKey } from "@/lib/utils/options";
import { matchesProductCategory } from "@/lib/utils/helpers/modals/catalogCascade";
import { getBrandOptions, getSupplierOptions, getTypeOptions } from "./cascadeFilterOptions";

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
		a.localeCompare(b, "es"),
	);
}

function brandBelongsToSupplier(
	brand: Brand,
	supplierName: string,
	suppliers: Supplier[],
): boolean {
	if (brand.proveedor_info?.nombre === supplierName) return true;
	const linked = suppliers.find((item) => String(item.id) === String(brand.proveedor_id));
	return linked?.nombre === supplierName;
}

function typeBelongsToBrand(type: Type, brandName: string, brands: Brand[]): boolean {
	if (type.marca_info?.nombre === brandName) return true;
	const linked = brands.find((item) => String(item.id) === String(type.marca_id));
	return linked?.nombre === brandName;
}

export function getCatalogFilterOptions<T extends FilterableItem>(
	suppliers: Supplier[],
	brands: Brand[],
	types: Type[],
	category: ProductCategoryFilter,
	filters: CascadeFilterValues,
	productItems: T[] = [],
): CascadeFilterOptions {
	const categoryBrands = brands.filter((item) =>
		matchesProductCategory(item.categoria, category),
	);
	const categoryTypes = types.filter((item) =>
		matchesProductCategory(item.categoria, category),
	);

	const catalogSuppliers = suppliers
		.filter((item) => matchesProductCategory(item.categoria, category))
		.map((item) => item.nombre ?? "");

	const catalogBrands = categoryBrands
		.filter((item) => !filters.supplier || brandBelongsToSupplier(item, filters.supplier, suppliers))
		.map((item) => item.nombre ?? "");

	const catalogTypes = categoryTypes
		.filter((item) => {
			if (filters.brand) return typeBelongsToBrand(item, filters.brand, brands);
			if (filters.supplier) {
				return categoryBrands.some(
					(brand) =>
						brandBelongsToSupplier(brand, filters.supplier, suppliers) &&
						typeBelongsToBrand(item, brand.nombre ?? "", brands),
				);
			}
			return true;
		})
		.map((item) => item.nombre ?? "");

	return {
		suppliers: uniqueSorted([...catalogSuppliers, ...getSupplierOptions(productItems)]),
		brands: uniqueSorted([...catalogBrands, ...getBrandOptions(productItems, filters.supplier)]),
		types: uniqueSorted([
			...catalogTypes,
			...getTypeOptions(productItems, filters.supplier, filters.brand),
		]),
	};
}

export function resolveCatalogCascadeFilters(
	getOptions: (filters: CascadeFilterValues) => CascadeFilterOptions,
	current: CascadeFilterValues,
	key: FilterKey,
	value: string,
): CascadeFilterValues {
	const next: CascadeFilterValues = { ...current, [key]: value };

	if (key === "supplier" || key === "brand") {
		const brands = getOptions(next).brands;
		if (next.brand && !brands.includes(next.brand)) {
			next.brand = "";
		}
	}

	const types = getOptions(next).types;
	if (next.type && !types.includes(next.type)) {
		next.type = "";
	}

	return next;
}
