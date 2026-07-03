import { FilterKey } from "@/lib/utils/options";
import { ProductFilterValues } from "../supabase/product-types";
import { MaterialesFilterValues } from "../supabase/materiales-types";
import { EquiposFilterValues } from "../supabase/equipos-types";

export type CascadeFilterOptions = {
	suppliers: string[];
	brands: string[];
	types: string[];
};

// Filtrado de materiales
export type MaterialesFiltersProps = {
    values: MaterialesFilterValues;
    filterOptions: CascadeFilterOptions;
    onFilterChange: (key: FilterKey, value: string) => void;
};

// Filtrado de equipos
export type EquiposFiltersProps = {
    values: EquiposFilterValues;
    filterOptions: CascadeFilterOptions;
    onFilterChange: (key: FilterKey, value: string) => void;
};