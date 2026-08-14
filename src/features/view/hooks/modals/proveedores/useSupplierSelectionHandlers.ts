import { useCallback, useEffect, useState } from "react";
import { SelectedSupplierlItem } from "@/lib/types/supabase/product-types";
import { Supplier } from "@/lib/types/supabase/supplier-types";
import { SelectedSupplierByRow } from "@/lib/types/components/sub_components/module_render";
import {
    getSupplierSelectOptions,
    SUPPLIER_ROW_KEY,
    toSelectedSupplierItem,
} from "@/lib/utils/helpers/modals/supplierOptions";

interface UseSupplierSelectionHandlersParams {
    supplier: Supplier[];
    brandCategoria?: string;
    initialSelected?: SelectedSupplierlItem[];
}

export function useSupplierSelectionHandlers({
    supplier,
    brandCategoria,
    initialSelected = [],
}: UseSupplierSelectionHandlersParams) {
    const [selectedSupplierByRow, setSelectedSupplierByRow] = useState<SelectedSupplierByRow>({});
    const [selectedSupplierTable, setSelectedSupplierTable] = useState<SelectedSupplierlItem[]>(initialSelected);

    useEffect(() => {
        setSelectedSupplierTable((current) => {
            let changed = false;
            const next = current.map((item) => {
                if (item.nombre) return item;
                const found = supplier.find((entry) => String(entry.id) === item.id);
                if (!found) return item;
                changed = true;
                return toSelectedSupplierItem(found);
            });
            return changed ? next : current;
        });
    }, [supplier]);

    const supplierOptions = getSupplierSelectOptions(
        supplier,
        selectedSupplierTable,
        brandCategoria,
    );

    const handleSupplierChange = useCallback((value: string) => {
        if (!value) {
            setSelectedSupplierByRow((prev) => {
                const next = { ...prev };
                delete next[SUPPLIER_ROW_KEY];
                return next;
            });
            return;
        }

        const selected = supplier.find((item) => String(item.id) === value);
        if (!selected) return;

        setSelectedSupplierByRow((prev) => ({
            ...prev,
            [SUPPLIER_ROW_KEY]: {
                supplierId: String(selected.id),
                description: selected.nombre ?? "",
            },
        }));
    }, [supplier]);

    const handleAddSupplier = useCallback(() => {
        const selectedSupplier = selectedSupplierByRow[SUPPLIER_ROW_KEY];
        if (!selectedSupplier?.supplierId) return;

        const isAlreadyAdded = selectedSupplierTable.some(
            (item) => item.id === selectedSupplier.supplierId,
        );
        const supplierDetails = supplier.find(
            (item) => String(item.id) === selectedSupplier.supplierId,
        );

        if (!isAlreadyAdded && supplierDetails) {
            setSelectedSupplierTable((prev) => [
                ...prev,
                toSelectedSupplierItem(supplierDetails),
            ]);
        }

        setSelectedSupplierByRow((prev) => {
            const next = { ...prev };
            delete next[SUPPLIER_ROW_KEY];
            return next;
        });
    }, [selectedSupplierByRow, selectedSupplierTable, supplier]);

    return {
        selectedSupplierByRow,
        selectedSupplierTable,
        setSelectedSupplierTable,
        supplierOptions,
        handleSupplierChange,
        handleAddSupplier,
    };
}
