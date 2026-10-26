import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { FilterKey } from "@/lib/types/components/General/options";
import { SelectorIcon } from "../../Icons/SelectorIcon";
import { EquiposFiltersProps, MetricSort } from "@/lib/types/components/Filter/filter_tables";
import { CATALOG_FILTERS } from "@/lib/utils/consts/catalogFilters";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import { CODE_ORDER_OPTIONS, DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS, INVERTER_CONNECTION_FILTER_OPTIONS, METRIC_ORDER_OPTIONS, Unidad_ModFV } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function EquiposFilters({
    values,
    filterOptions,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
    connectionType,
    moduleUnit,
    onConnectionTypeChange,
    onModuleUnitChange,
    sheet,
    codeOrder,
    onCodeOrderChange,
    metricSort,
    onMetricSortChange,
}: EquiposFiltersProps) {
    const showConnectionFilter = sheet === "especificas" && values.type === "INVERSOR";
    const showUnitFilter = sheet === "especificas" && values.type === "MÓDULO FV";
    const filters = sheet === "especificas"
        ? CATALOG_FILTERS.filter((filter) => filter.id === "type")
        : CATALOG_FILTERS;

    function metricValue(field: string) {
        return metricSort?.field === field ? metricSort.order : "";
    }

    function changeMetric(field: string, order: string) {
        if (!order) {
            onMetricSortChange(metricSort?.field === field ? null : metricSort);
            return;
        }
        onMetricSortChange({ field, order: order as MetricSort["order"] });
    }

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
        {showConnectionFilter && (
            <TableFilterSelect
                label="Filtrar por tipo de conexión"
                placeholder="Todas las conexiones"
                value={connectionType}
                options={[...INVERTER_CONNECTION_FILTER_OPTIONS]}
                onChange={onConnectionTypeChange}
            />
        )}
        {showUnitFilter && (
            <TableFilterSelect
                label="Filtrar por unidad"
                placeholder="Todas las unidades"
                value={moduleUnit}
                options={[...Unidad_ModFV]}
                onChange={onModuleUnitChange}
            />
        )}
        {sheet === "especificas" && values.type === "MÓDULO FV" && (
            <TableFilterSelect
                label="Ordenar por potencia máxima"
                placeholder="Sin orden"
                value={metricValue("potencia_maxima")}
                options={METRIC_ORDER_OPTIONS}
                icon="sort"
                onChange={(value) => changeMetric("potencia_maxima", value)}
            />
        )}
        {sheet === "especificas" && values.type === "INVERSOR" && (
            <>
                <TableFilterSelect
                    label="Ordenar por potencia máxima"
                    placeholder="Sin orden"
                    value={metricValue("potencia_maxima")}
                    options={METRIC_ORDER_OPTIONS}
                    icon="sort"
                    onChange={(value) => changeMetric("potencia_maxima", value)}
                />
                <TableFilterSelect
                    label="Ordenar por potencia AC"
                    placeholder="Sin orden"
                    value={metricValue("potencia_ac")}
                    options={METRIC_ORDER_OPTIONS}
                    icon="sort"
                    onChange={(value) => changeMetric("potencia_ac", value)}
                />
            </>
        )}
        {sheet === "especificas" && values.type === "BATERÍA" && (
            <>
                <TableFilterSelect
                    label="Ordenar por DoD"
                    placeholder="Sin orden"
                    value={metricValue("dod")}
                    options={METRIC_ORDER_OPTIONS}
                    icon="sort"
                    onChange={(value) => changeMetric("dod", value)}
                />
                <TableFilterSelect
                    label="Ordenar por VMPP / VMIN"
                    placeholder="Sin orden"
                    value={metricValue("vmpp_vmin")}
                    options={METRIC_ORDER_OPTIONS}
                    icon="sort"
                    onChange={(value) => changeMetric("vmpp_vmin", value)}
                />
            </>
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
