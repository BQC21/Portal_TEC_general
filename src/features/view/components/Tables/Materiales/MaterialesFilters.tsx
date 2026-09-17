import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { FilterKey } from "@/lib/utils/options";
import { SelectorIcon } from "../../Icons/SelectorIcon";
import { MaterialesFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { CATALOG_FILTERS } from "@/lib/utils/helpers/filters/catalogFilterOptions";

export function MaterialesFilters({ values, filterOptions, onFilterChange }: MaterialesFiltersProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
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
        </div>
    );
}
