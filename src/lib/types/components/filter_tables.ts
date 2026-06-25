import { FilterKey } from "@/lib/utils/options";
import { ProductFilterValues } from "../supabase/product-types";
import { MaterialesFilterValues } from "../supabase/materiales-types";
import { EquiposFilterValues } from "../supabase/equipos-types";

// Filtrado de productos
export type ProductFiltersProps = {
    values: ProductFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};

// Filtrado de materiales
export type MaterialesFiltersProps = {
    values: MaterialesFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};

// Filtrado de equipos
export type EquiposFiltersProps = {
    values: EquiposFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};