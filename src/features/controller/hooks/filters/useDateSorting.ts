"use client";

import { useCallback, useMemo, useState } from "react";
import { DateSortOrder } from "@/lib/types/components/General/options";
import { applyDateSorting } from "@/lib/utils/helpers/sorting/dateSorting";

type DatedRow = {
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

export function useDateSorting<T extends DatedRow>(rows: T[]) {
    const [createdOrder, setCreatedOrderState] = useState<DateSortOrder>("");
    const [updatedOrder, setUpdatedOrderState] = useState<DateSortOrder>("");

    const setCreatedOrder = useCallback((order: DateSortOrder) => {
        setCreatedOrderState(order);
        if (order) setUpdatedOrderState("");
    }, []);

    const setUpdatedOrder = useCallback((order: DateSortOrder) => {
        setUpdatedOrderState(order);
        if (order) setCreatedOrderState("");
    }, []);

    const sortedRows = useMemo(
        () => applyDateSorting(rows, createdOrder, updatedOrder),
        [rows, createdOrder, updatedOrder],
    );

    return {
        sortedRows,
        createdOrder,
        updatedOrder,
        setCreatedOrder,
        setUpdatedOrder,
    };
}
