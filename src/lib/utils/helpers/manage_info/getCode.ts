import type { ProductCategoryFilter } from "@/lib/types/components/sub_components/module_render";
import { TypeFormstate } from "@/lib/types/supabase/type-types";

function normalizeTypeCategory(categoria?: string) {
    return (categoria ?? "").trim().toLowerCase();
}

// --- Primer dígito del código según categoría del tipo de producto ---
export function getProductTypeCode(
    tipo: TypeFormstate,
    productCategory?: ProductCategoryFilter,
) {
    const categoria = normalizeTypeCategory(tipo.categoria);

    if (categoria === "equipos" || categoria === "equipo") return "E";
    if (categoria === "materiales" || categoria === "material") return "M";
    if (categoria === "ambas") {
        if (productCategory === "Equipos") return "E";
        if (productCategory === "Materiales") return "M";
    }

    return "";
}
