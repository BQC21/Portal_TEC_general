import { DateSortField, DateSortOrder } from "@/lib/types/components/General/options";

type DatedRow = {
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

function toTimestamp(value: Date | string | null | undefined): number {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
}

export function shouldRender_DateSortingSelection(
    field: DateSortField,
    currentOrder: DateSortOrder,
) {
    const fieldLabel = field === "created_at" ? "fecha creada" : "fecha actualizada";

    if (currentOrder === "asc") {
        return { label: `Orden ascendente (${fieldLabel})`, nextOrder: "desc" as const };
    }

    if (currentOrder === "desc") {
        return { label: `Orden descendente (${fieldLabel})`, nextOrder: "" as const };
    }

    return { label: `Ordenar por ${fieldLabel}`, nextOrder: "asc" as const };
}

export function sortByDateField<T extends DatedRow>(
    rows: T[],
    field: DateSortField,
    order: DateSortOrder,
): T[] {
    if (!order) return rows;

    return [...rows].sort((left, right) => {
        const delta = toTimestamp(left[field]) - toTimestamp(right[field]);
        return order === "asc" ? delta : -delta;
    });
}

export function applyDateSorting<T extends DatedRow>(
    rows: T[],
    createdOrder: DateSortOrder,
    updatedOrder: DateSortOrder,
): T[] {
    if (updatedOrder) return sortByDateField(rows, "updated_at", updatedOrder);
    if (createdOrder) return sortByDateField(rows, "created_at", createdOrder);
    return rows;
}
