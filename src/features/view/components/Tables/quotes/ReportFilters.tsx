import { ReportFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function ReportFilters({
    values,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: ReportFiltersProps) {
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
                label="Ordenar por Precio de cotización"
                placeholder={DATE_SORT_PLACEHOLDER}
                value={values.precio_orden}
                options={[...DATE_SORT_SELECT_OPTIONS]}
                icon="sort"
                onChange={(value) => onFilterChange("precio_orden", value)}
            />
        </div>
    );
}
