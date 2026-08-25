"use client";

import { useCallback, useMemo, useState } from "react";
import { useBrands } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores } from "@/features/view/hooks/services/useRealtimeProveedores";
import { useTypes } from "@/features/view/hooks/services/useRealtimeTipos";
import { CascadeFilterValues, FilterableItem } from "@/lib/types/components/Filter/cascadeFilter";
import { ProductCategoryFilter } from "@/lib/types/components/sub_components/module_render";
import { FilterKey } from "@/lib/utils/options";
import {
	getCatalogFilterOptions,
	resolveCatalogCascadeFilters,
} from "@/lib/utils/helpers/filters/catalogFilterOptions";

export function useCatalogCascadeFilters<T extends FilterableItem>(
	items: T[],
	category: ProductCategoryFilter,
) {
	const { supplier } = useProveedores();
	const { brand } = useBrands();
	const { type } = useTypes();
	const [filters, setFilters] = useState<CascadeFilterValues>({
		type: "",
		brand: "",
		supplier: "",
	});

	const buildOptions = useCallback(
		(currentFilters: CascadeFilterValues) =>
			getCatalogFilterOptions(supplier, brand, type, category, currentFilters, items),
		[supplier, brand, type, category, items],
	);

	const filterOptions = useMemo(
		() => buildOptions(filters),
		[buildOptions, filters],
	);

	const handleFilterChange = useCallback(
		(key: FilterKey, value: string) => {
			setFilters((current) =>
				resolveCatalogCascadeFilters(buildOptions, current, key, value),
			);
		},
		[buildOptions],
	);

	return {
		filters,
		filterOptions,
		handleFilterChange,
	};
}
