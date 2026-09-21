import { useMemo } from "react";
import { ReportFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import { uniquePriceOptions } from "@/lib/utils/helpers/filters/tableFilterOptions";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function ReportFilters({
    reports,
    values,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: ReportFiltersProps) {
    const priceOptions = useMemo(
        () => uniquePriceOptions(reports.map((report) => report.cotizacion_info?.precio_dolares)),
        [reports],
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <TableFilterSelect
                label="Filtrar por Precio de cotización"
                placeholder="Todos los"
                value={values.precio_cotizacion}
                options={priceOptions}
                onChange={(value) => onFilterChange("precio_cotizacion", value)}
            />
        </div>
    );
}
