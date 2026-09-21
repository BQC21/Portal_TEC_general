import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { FilterKey } from "@/lib/types/components/General/options";
import { SelectorIcon } from "../../Icons/SelectorIcon";
import { MaterialesFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { CATALOG_FILTERS } from "@/lib/utils/consts/catalogFilters";
import { TableFilterSelect } from "../shared/TableFilterSelect";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function MaterialesFilters({
    values,
    filterOptions,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: MaterialesFiltersProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {CATALOG_FILTERS.map((filter) => (
            <label key={filter.id} className="space-y-2">
                <span className="block text-center text-lg font-semibold text-slate-600">{filter.label}</span>
                <div className="relative">
                    <FilterIcon />
                    <select
                        className="filter-control h-12 w-full appearance-none pl-11 pr-10"
                        value={values[filter.id as FilterKey] ?? ""}
                        onChange={(event) => {
                            onFilterChange(filter.id as FilterKey, event.target.value);
                        }}
                    >
                        <option value="">{filter.placeholder}</option>
                        {filterOptions[filter.optionsKey].map((item: string) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                    </select>
                    <SelectorIcon/>
                </div>
            </label>
        ))}
        <TableFilterSelect
            label="Ordenar por Fecha creada"
            placeholder={DATE_SORT_PLACEHOLDER}
            value={createdOrder}
            options={[...DATE_SORT_SELECT_OPTIONS]}
            icon="sort"
            onChange={(value) => onCreatedOrderChange(value as DateSortOrder)}
        />
        <TableFilterSelect
            label="Ordenar por Fecha actualizada"
            placeholder={DATE_SORT_PLACEHOLDER}
            value={updatedOrder}
            options={[...DATE_SORT_SELECT_OPTIONS]}
            icon="sort"
            onChange={(value) => onUpdatedOrderChange(value as DateSortOrder)}
        />
        </div>
    );
}
