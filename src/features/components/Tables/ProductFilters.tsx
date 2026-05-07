import { useMemo } from "react";
import { FilterIcon } from "@/features/components/Icons/FilterIcon";
import { 
    SUPPLIER_OPTIONS, 
    PRODUCT_TYPE_OPTIONS, 
    BRAND_OPTIONS 
} from "@/lib/utils/options"
import { shouldRender_ProductInfoSelection } from "@/lib/utils/renders";
import { ProductFilterValues } from "@/lib/types/product-types"
import type { FilterKey } from "@/lib/utils/options"; // Tipados

const FILTERS = [
    {
        id: "type",
        label: "Filtrar por Tipo",
        placeholder: "Todos los Tipos",
        content: PRODUCT_TYPE_OPTIONS,
    },
    {
        id: "brand",
        label: "Filtrar por Marca",
        placeholder: "Todas las Marcas",
        content: BRAND_OPTIONS,
    },
    {
        id: "supplier",
        label: "Filtrar por Proveedor",
        placeholder: "Todos los Proveedores",
        content: SUPPLIER_OPTIONS,
    },
];

type ProductFiltersProps = {
    values: ProductFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};

export function ProductFilters({ values, onFilterChange }: ProductFiltersProps) {
    const brandFilterOptions = useMemo(() => {
        if (!values.type) {
            return BRAND_OPTIONS;
        }

        const { brand_options } = shouldRender_ProductInfoSelection(values.type);
        return brand_options.length > 0 ? brand_options : BRAND_OPTIONS;
    }, [values.type]);

    return (
        <div className="grid gap-4 lg:grid-cols-3">
        {FILTERS.map((filter) => (
            <label key={filter.id} className="space-y-2">
            <span className="block text-center text-lg font-semibold text-slate-600">{filter.label}</span>
            <div className="relative">
                <FilterIcon />
                <select
                    className="filter-control h-12 w-full appearance-none pl-11 pr-10"
                    value={values[filter.id as FilterKey] ?? ""}
                    onChange={(event) => {
                        const nextValue = event.target.value;

                        if (filter.id === "type") {
                            onFilterChange("type", nextValue);

                            const { brand_options } = shouldRender_ProductInfoSelection(nextValue);
                            if (values.brand && brand_options.length > 0 && !brand_options.includes(values.brand)) {
                                onFilterChange("brand", "");
                            }
                            return;
                        }

                        onFilterChange(filter.id as FilterKey, nextValue);
                    }}
                >
                <option value="">{filter.placeholder}</option>
                {(filter.id === "brand" ? brandFilterOptions : filter.content).map((item: string) => (
                    <option key={item} value={item}>
                    {item}
                    </option>
                ))}
                </select>
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
            </div>
            </label>
        ))}
        </div>
    );
}