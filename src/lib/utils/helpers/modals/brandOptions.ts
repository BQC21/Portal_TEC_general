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
    type: Pick<Type, "marca_id" | "marca_info">,
    brands: Brand[] = [],
): SelectedBrandItem[] {
    const info = type.marca_info;
    const id = info?.id != null ? String(info.id) : type.marca_id;

    if (!id) return [];

    const found = brands.find((item) => String(item.id) === String(id));
    if (found) return [toSelectedBrandItem(found)];

    return [{
        row: BRAND_ROW_LABEL,
        id: String(id),
        nombre: info?.nombre ?? "",
        categoria: info?.categoria ?? "",
    }];
}

export function applySelectedBrandsToType(
    form: TypeFormstate,
    selectedBrandTable: SelectedBrandItem[],
): TypeFormstate {
    const firstBrand = selectedBrandTable[0];

    return {
        ...form,
        marca_id: firstBrand?.id ?? form.marca_id,
        marca_info: firstBrand
            ? {
                id: firstBrand.id,
                nombre: firstBrand.nombre,
                categoria: firstBrand.categoria,
                proveedor_id: form.marca_info?.proveedor_id ?? "",
            }
            : form.marca_info,
    };
}
