import { Brand, BrandFormstate } from "@/lib/types/supabase/brand.types";
import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { INITIAL_BRAND_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function useBrandSelection(
    value: string, brand: Brand[],
    setForm_marca:  (value: SetStateAction<BrandFormstate>) => void,
    setForm: (value: SetStateAction<EquiposFormState>) => void

) {
    function updateField<K extends keyof BrandFormstate>(field: K, value: BrandFormstate[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    if (value === "Seleccione marca") {
        setForm_marca(INITIAL_BRAND_FORM);
        return;
    }

    const selected = brand.find((brand) => brand.nombre === value);

    if (selected) {
        setForm_marca({
            nombre: selected.nombre,
            categoria: selected.categoria,
            created_at: selected.created_at,
            updated_at: selected.updated_at,
        });
    }
}