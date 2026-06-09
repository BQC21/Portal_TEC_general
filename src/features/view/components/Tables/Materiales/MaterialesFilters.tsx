import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import type { MaterialesFilterValues } from "@/lib/types/materiales-types";
import { shouldRender_ProductInfoSelection } from "@/lib/utils/helpers/renders";
import { 
    SUPPLIER_OPTIONS, 
    MATERIALES_TYPE_OPTIONS, 
    BRAND_OPTIONS,
    FilterKey
} from "@/lib/utils/options"
import { useMemo } from "react";
import { SelectorIcon } from "../../Icons/SelectorIcon";

const FILTERS = [
    {
        id: "type",
        label: "Filtrar por Tipo",
        placeholder: "Todos los Tipos",
        content: MATERIALES_TYPE_OPTIONS,
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


type MaterialesFiltersProps = {
    values: MaterialesFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};

export function MaterialesFilters({ values, onFilterChange }: MaterialesFiltersProps) {

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
                    <SelectorIcon/>
                </div>
            </label>
        ))}
        </div>
    );
}