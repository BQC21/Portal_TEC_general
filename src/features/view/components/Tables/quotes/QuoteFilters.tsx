import { useMemo } from "react";
import { QuoteFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import { uniqueNonEmptyValues } from "@/lib/utils/helpers/filters/tableFilterOptions";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";
import { formatVersionLabel } from "@/lib/utils/helpers/manage_info/version";

const INDEPENDENCE_OPTIONS = [
    { value: "independiente", label: "Independiente" },
    { value: "unidas", label: "Cotizaciones unidas" },
    { value: "asociado", label: "Asociado" },
];

export function QuoteFilters({
    quotes,
    values,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: QuoteFiltersProps) {
    const versionOptions = useMemo(
        () => uniqueNonEmptyValues(quotes.map((quote) => formatVersionLabel(quote.version))),
        [quotes],
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                label="Ordenar por Precio de venta"
                placeholder={DATE_SORT_PLACEHOLDER}
                value={values.precio_orden}
                options={[...DATE_SORT_SELECT_OPTIONS]}
                icon="sort"
                onChange={(value) => onFilterChange("precio_orden", value)}
            />
            <TableFilterSelect
                label="Filtrar por versión"
                placeholder="Todas las versiones"
                value={values.version}
                options={versionOptions}
                onChange={(value) => onFilterChange("version", value)}
            />
            <TableFilterSelect
                label="Filtrar por independencia"
                placeholder="Todas"
                value={values.independencia}
                options={INDEPENDENCE_OPTIONS}
                onChange={(value) => onFilterChange("independencia", value)}
            />
        </div>
    );
}
