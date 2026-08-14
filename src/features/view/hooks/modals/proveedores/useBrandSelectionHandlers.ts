import { useCallback, useEffect, useState } from "react";
import { SelectedBrandItem } from "@/lib/types/supabase/product-types";
import { Brand } from "@/lib/types/supabase/brand.types";
import { SelectedBrandByRow } from "@/lib/types/components/sub_components/module_render";
import {
    BRAND_ROW_KEY,
    getBrandSelectOptions,
    toSelectedBrandItem,
} from "@/lib/utils/helpers/modals/brandOptions";

interface UseBrandSelectionHandlersParams {
    brand: Brand[];
    typeCategoria?: string;
    initialSelected?: SelectedBrandItem[];
}

export function useBrandSelectionHandlers({
    brand,
    typeCategoria,
    initialSelected = [],
}: UseBrandSelectionHandlersParams) {
    const [selectedBrandByRow, setSelectedBrandByRow] = useState<SelectedBrandByRow>({});
    const [selectedBrandTable, setSelectedBrandTable] = useState<SelectedBrandItem[]>(initialSelected);

    useEffect(() => {
        setSelectedBrandTable((current) => {
            let changed = false;
            const next = current.map((item) => {
                if (item.nombre) return item;
                const found = brand.find((entry) => String(entry.id) === item.id);
                if (!found) return item;
                changed = true;
                return toSelectedBrandItem(found);
            });
            return changed ? next : current;
        });
    }, [brand]);

    const brandOptions = getBrandSelectOptions(
        brand,
        selectedBrandTable,
        typeCategoria,
    );

    const handleBrandChange = useCallback((value: string) => {
        if (!value) {
            setSelectedBrandByRow((prev) => {
                const next = { ...prev };
                delete next[BRAND_ROW_KEY];
                return next;
            });
            return;
        }

        const selected = brand.find((item) => String(item.id) === value);
        if (!selected) return;

        setSelectedBrandByRow((prev) => ({
            ...prev,
            [BRAND_ROW_KEY]: {
                brandId: String(selected.id),
                description: selected.nombre ?? "",
            },
        }));
    }, [brand]);

    const handleAddBrand = useCallback(() => {
        const selectedBrand = selectedBrandByRow[BRAND_ROW_KEY];
        if (!selectedBrand?.brandId) return;

        const isAlreadyAdded = selectedBrandTable.some(
            (item) => item.id === selectedBrand.brandId,
        );
        const brandDetails = brand.find(
            (item) => String(item.id) === selectedBrand.brandId,
        );

        if (!isAlreadyAdded && brandDetails) {
            setSelectedBrandTable((prev) => [
                ...prev,
                toSelectedBrandItem(brandDetails),
            ]);
        }

        setSelectedBrandByRow((prev) => {
            const next = { ...prev };
            delete next[BRAND_ROW_KEY];
            return next;
        });
    }, [selectedBrandByRow, selectedBrandTable, brand]);

    return {
        selectedBrandByRow,
        selectedBrandTable,
        setSelectedBrandTable,
        brandOptions,
        handleBrandChange,
        handleAddBrand,
    };
}
