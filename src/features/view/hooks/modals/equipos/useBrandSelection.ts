import { Brand, BrandFormstate } from "@/lib/types/supabase/brand.types";
import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { INITIAL_BRAND_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function useBrandSelection(
    value: string,
    brand: Brand[],
    setForm_marca: (value: SetStateAction<BrandFormstate>) => void,
    setForm: (value: SetStateAction<EquiposFormState>) => void,
) {
    if (value === "Seleccione marca") {
        setForm_marca(INITIAL_BRAND_FORM);
        setForm((current) => ({
            ...current,
            marca: "",
            marca_id: "",
            tipo_de_producto: "",
            tipo_id: "",
            unidad: "",
        }));
        return;
    }

    const selected = brand.find((item) => item.nombre === value);

    if (!selected) return;

    setForm_marca({
        nombre: selected.nombre,
        categoria: selected.categoria,
        created_at: selected.created_at,
        updated_at: selected.updated_at,
        proveedor_id: selected.proveedor_id,
        proveedor_info: selected.proveedor_info,
    });

    setForm((current) => ({
        ...current,
        marca: selected.nombre ?? "",
        marca_id: selected.id?.toString() ?? "",
        tipo_de_producto: "",
        tipo_id: "",
        unidad: "",
    }));
}
