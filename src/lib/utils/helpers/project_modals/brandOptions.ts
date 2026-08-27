import { SelectOption } from "@/lib/types/components/General/form_fields";
import { Brand } from "@/lib/types/supabase/brand.types";
import { SelectedBrandItem } from "@/lib/types/supabase/product-types";
import { Type, TypeFormstate } from "@/lib/types/supabase/type-types";
import { defaultSelectOption } from "@/lib/utils/helpers/project_modals/productOptions";

export const BRAND_ROW_LABEL = "MARCA";
export const BRAND_ROW_KEY = `${BRAND_ROW_LABEL}-0`;

export function matchesTypeCategory(typeCategoria?: string, brandCategoria?: string) {
    if (!typeCategoria || typeCategoria === "Ambas") return true;
    return brandCategoria === typeCategoria || brandCategoria === "Ambas";
}

export function toBrandSelectOption(item: Brand): SelectOption {
    return {
        value: String(item.id ?? ""),
        label: item.categoria
            ? `${item.nombre ?? ""} (${item.categoria})`
            : (item.nombre ?? ""),
    };
}
export function toSelectedBrandItem(item: Brand): SelectedBrandItem {
    return {
        row: BRAND_ROW_LABEL,
        id: String(item.id ?? ""),
        nombre: item.nombre ?? "",
        categoria: item.categoria ?? "",
    };
}

export function getBrandSelectOptions(
    brands: Brand[],
    selectedBrandTable: SelectedBrandItem[],
    typeCategoria?: string,
): SelectOption[] {
    return [
        defaultSelectOption(BRAND_ROW_LABEL),
        ...brands
            .filter((item) => {
                if (!matchesTypeCategory(typeCategoria, item.categoria)) return false;
                return !selectedBrandTable.some((selected) => selected.id === String(item.id));
            })
            .map(toBrandSelectOption),
    ];
}

export function selectedBrandsFromType(
    type: Pick<Type, "marca_id" | "marca_ids" | "marca_info" | "marcas_info">,
    brands: Brand[] = [],
): SelectedBrandItem[] {
    const ids = Array.from(new Set([
        ...(type.marca_ids ?? []),
        type.marca_id,
        type.marca_info?.id != null ? String(type.marca_info.id) : "",
        ...(type.marcas_info ?? []).map((item) => String(item.id ?? "")),
    ].map((id) => String(id ?? "").trim()).filter(Boolean)));

    return ids.map((id) => {
        const found = brands.find((item) => String(item.id) === id);
        if (found) return toSelectedBrandItem(found);

        const info = (type.marcas_info ?? []).find((item) => String(item.id) === id) ?? (
            String(type.marca_info?.id) === id ? type.marca_info : undefined
        );

        return {
            row: BRAND_ROW_LABEL,
            id,
            nombre: info?.nombre ?? "",
            categoria: info?.categoria ?? "",
        };
    });
}

export function applySelectedBrandsToType(
    form: TypeFormstate,
    selectedBrandTable: SelectedBrandItem[],
): TypeFormstate {
    const marca_ids = selectedBrandTable.map((item) => item.id).filter(Boolean);

    return {
        ...form,
        marca_id: marca_ids[0] ?? "",
        marca_ids,
        marca_info: selectedBrandTable[0]
            ? {
                id: selectedBrandTable[0].id,
                nombre: selectedBrandTable[0].nombre,
                categoria: selectedBrandTable[0].categoria,
                proveedor_id: form.marca_info?.proveedor_id ?? "",
                proveedor_ids: form.marca_info?.proveedor_ids ?? [],
            }
            : undefined,
        marcas_info: selectedBrandTable.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            categoria: item.categoria,
            proveedor_id: "",
            proveedor_ids: [],
        })),
    };
}
