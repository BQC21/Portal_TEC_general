import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { FilterKey } from "@/lib/types/components/General/options";
import { SelectorIcon } from "../../Icons/SelectorIcon";
import { MaterialesFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { CATALOG_FILTERS } from "@/lib/utils/consts/catalogFilters";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import {
    DATE_SORT_PLACEHOLDER,
    DATE_SORT_SELECT_OPTIONS,
    ELECTRICAL_PART_FILTER_OPTIONS,
    ELECTRICAL_PART_FILTER_TYPES,
} from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

const CODE_ORDER_OPTIONS = [
    { value: "asc", label: "Ascendente" },
    { value: "desc", label: "Descendente" },
];

export function MaterialesFilters({
    values,
    filterOptions,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
    parteElectrica,
    onParteElectricaChange,
    sheet,
    codeOrder,
    onCodeOrderChange,
}: MaterialesFiltersProps) {
    const showElectricalPartFilter = sheet === "especificas"
        && ELECTRICAL_PART_FILTER_TYPES.includes(values.type);
    const filters = sheet === "especificas"
        ? CATALOG_FILTERS.filter((filter) => filter.id === "type")
        : CATALOG_FILTERS;

    const filterRow = (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {filters.map((filter) => (
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
        {showElectricalPartFilter && (
            <TableFilterSelect
                label="Filtrar por parte eléctrica"
                placeholder="Todas las partes"
                value={parteElectrica}
                options={[...ELECTRICAL_PART_FILTER_OPTIONS]}
                onChange={onParteElectricaChange}
            />
        )}
        </div>
    );

    if (sheet !== "generales") return filterRow;

    return (
        <div className="space-y-4">
            {filterRow}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <TableFilterSelect
                    label="Ordenar por código del proveedor"
                    placeholder="Ascendente"
                    value={codeOrder}
                    options={CODE_ORDER_OPTIONS}
                    icon="sort"
                    onChange={(value) => onCodeOrderChange(value === "desc" ? "desc" : "asc")}
                />
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
        </div>
    );
}
