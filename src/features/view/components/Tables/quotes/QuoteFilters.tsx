import { useMemo } from "react";
import { QuoteFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { TableFilterSelect } from "../shared/TableFilterSelect";
import { uniquePriceOptions } from "@/lib/utils/helpers/filters/tableFilterOptions";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function QuoteFilters({
    quotes,
    values,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: QuoteFiltersProps) {
    const priceOptions = useMemo(
        () => uniquePriceOptions(quotes.map((quote) => quote.precio_dolares)),
        [quotes],
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
                label="Filtrar por Precio de venta"
                placeholder="Todos los Precios de venta"
                value={values.precio_dolares}
                options={priceOptions}
                onChange={(value) => onFilterChange("precio_dolares", value)}
            />
        </div>
    );
}
